using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SMS.Common.RigsWebService;
using SMS.Common.Services.Posting;
using SMS.Common.Services.RigsWeb;
using SMS.Infrastructure.SMSTextSender;

namespace SMS.Common;

public static class CommonServiceRegistration
{
    public static IServiceCollection AddCommonServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAllocationService, AllocationService>();
        services.AddScoped<IShareService, ShareService>();
        services.AddScoped<IParValueService, ParValueService>();
        services.AddScoped<IDividendService, DividendService>();
        services.AddScoped<IRigsWebService, RubikonInterface>();
        services.AddScoped<IEodService, EndOfDayInterface>();
        services.AddScoped<ITaxDuePostingService, TaxDueDatePostingInterface>();
        services.AddScoped<IDecisionPostingService, DecisionPostingInterface>();
        services.AddScoped<IShareholderSummaryService, ShareholderSummaryService>();

        if (configuration.GetValue<bool>("Email:UseLocalEmailService"))
        {
            services.AddTransient<IEmailSenderService, LocalEmailSenderService>();
        }
        else
        {
            services.AddTransient<IEmailSenderService, ExchangeEmailSenderService>();
        }
        if (configuration.GetValue<bool>("SMS:UseLocalSMSService"))
        {
            services.AddScoped<ISMSWebService, LocalSMSSenderService>();
        }
        else
        {
            services.AddScoped<ISMSWebService, SMSSenderService>();
        }

        return services;
    }
}
