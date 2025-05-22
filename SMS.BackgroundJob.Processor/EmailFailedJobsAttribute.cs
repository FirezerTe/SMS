using FluentEmail.Liquid;
using Hangfire.Common;
using Hangfire.States;
using Hangfire.Storage;
using SMS.Common;
using Microsoft.Extensions.Options;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.BackgroundJob.Processor;

public class EmailFailedJobsAttribute : JobFilterAttribute, IApplyStateFilter
{
    private readonly IServiceProvider serviceProvider;

    public EmailFailedJobsAttribute(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider;
    }

    public void OnStateApplied(ApplyStateContext context, IWriteOnlyTransaction transaction)
    {
        var failedState = context.NewState as FailedState;
        if (failedState != null)
        {
            using (var serviceScope = serviceProvider.CreateScope())
            {
                var services = serviceScope.ServiceProvider;

                var dataService = services.GetRequiredService<IDataService>();
                var backgroundJobScheduler = services.GetRequiredService<IBackgroundJobScheduler>();
                var configuration = services.GetRequiredService<IConfiguration>();
                var toEmail = configuration.GetValue<string>("SupportTeamEmail");

                var emailTemplate = dataService.EmailTemplates.FirstOrDefault(t => t.EmailType == EmailType.BackgroundJobFailed);
                if (emailTemplate != null && toEmail != null)
                {
                    var JobId = context.BackgroundJob.Id;
                    var FailedAt = failedState.FailedAt.ToLocalTime().ToString() ?? "";
                    var Server = failedState.ServerId ?? "";
                    var Exception = failedState.Exception.ToString() ?? "";
                    var renderer = new LiquidRenderer(Options.Create(new LiquidRendererOptions()));
                    var body = renderer.Parse(emailTemplate.Template, new { JobId, Exception, FailedAt, Server }, emailTemplate.IsHtml);

                    var email = new Email()
                    {
                        EmailTemplateId = emailTemplate.Id,
                        Subject = "SMS Background Job Failed",
                        ToEmail = toEmail,
                        ToName = "SMS Support Team",
                        Body = body,
                        IsHtml = emailTemplate.IsHtml,
                        Sent = false,
                    };

                    dataService.Emails.Add(email);

                    dataService.SaveAsync(default).GetAwaiter().GetResult();

                    backgroundJobScheduler.EnqueueEmail(email.Id);
                }
            }
        }
    }

    public void OnStateUnapplied(ApplyStateContext context, IWriteOnlyTransaction transaction)
    {
    }
}
