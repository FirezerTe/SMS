using Hangfire;
using Hangfire.Storage;
using SMS.Common;

namespace SMS.BackgroundJob.Scheduler;

public class BackgroundRecurringJobsSchedulerService : IBackgroundRecurringJobsScheduler
{
    public void RemoveAll()
    {
        using (var connection = JobStorage.Current.GetConnection())
        {
            foreach (var recurringJob in connection.GetRecurringJobs())
            {
                RecurringJob.RemoveIfExists(recurringJob.Id);
            }
        }
    }

    public void ScheduleAll()
    {
        ComputeAllAllocationSummaries();
    }

    public void ComputeAllAllocationSummaries()
    {
        RecurringJob.AddOrUpdate<IShareholderSummaryService>(RecurringJobID.ComputeShareholderSummary,
                                                     service => service.ComputeAllShareholdersSummary(default),
                                                     "0 2 * * *", //Everyday at 2:00AM
                                                     new RecurringJobOptions()
                                                     {
                                                         TimeZone = TimeZoneInfo.Local
                                                     });
    }
}
