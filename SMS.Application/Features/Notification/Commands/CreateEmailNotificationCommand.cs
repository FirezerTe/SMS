using FluentEmail.Liquid;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SMS.Domain;
using SMS.Domain.Enums;
using System.Net;

namespace SMS.Application;

public class CreateEmailNotificationCommand : IRequest
{
    public EmailNotification Notification { get; set; }
}


public class CreateEmailNotificationCommandHandler : IRequestHandler<CreateEmailNotificationCommand>
{
    private readonly IDataService dataService;
    private readonly IBackgroundJobScheduler backgroundJobService;
    private readonly ILogger<CreateEmailNotificationCommandHandler> logger;

    public CreateEmailNotificationCommandHandler(IDataService dataService,
        IBackgroundJobScheduler backgroundJobService,
        ILogger<CreateEmailNotificationCommandHandler> logger)
    {
        this.dataService = dataService;
        this.backgroundJobService = backgroundJobService;
        this.logger = logger;
    }

    public async Task Handle(CreateEmailNotificationCommand request, CancellationToken cancellationToken)
    {
        var emailTemplate = await dataService.EmailTemplates.FirstOrDefaultAsync(t => t.EmailType == request.Notification.EmailType);

        if (emailTemplate != null)
        {

            var renderer = new LiquidRenderer(Options.Create(new LiquidRendererOptions()));
            var body = await renderer.ParseAsync(emailTemplate.Template, request.Notification.Model, emailTemplate.IsHtml);


            if (emailTemplate.EmailType == EmailType.EODTransactionFailed)
            {
                // Decode the HTML content after rendering
                body = WebUtility.HtmlDecode(body);
            }
            var email = new Email()
            {
                EmailTemplateId = emailTemplate.Id,
                Subject = request.Notification.Subject,
                ToEmail = request.Notification.ToEmail,
                ToName = request.Notification.ToName,
                Body = body,
                IsHtml = emailTemplate.IsHtml,
                Sent = false,
            };

            dataService.Emails.Add(email);

            await dataService.SaveAsync(cancellationToken);

            backgroundJobService.EnqueueEmail(email.Id);
        }
        else
        {
            logger.LogError("Unable to find email template for Email Type:{emailType}", request.Notification.EmailType);
        }
    }
}
