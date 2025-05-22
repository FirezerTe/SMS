using Microsoft.Extensions.DependencyInjection;
using SMS.BackgroundJob.Scheduler;
using SMS.Common;

namespace SMS.BackgroundJob;


public static class BackgroundJobSchedulerRegistration
{
    public static IServiceCollection AddBackgroundSchedulerService(this IServiceCollection services)
    {
        services.AddScoped<IBackgroundJobScheduler, BackgroundJobSchedulerService>();
        services.AddScoped<IBackgroundRecurringJobsScheduler, BackgroundRecurringJobsSchedulerService>();

        return services;
    }
}
