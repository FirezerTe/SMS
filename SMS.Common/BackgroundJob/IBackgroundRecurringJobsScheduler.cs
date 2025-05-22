namespace SMS.Common;

public interface IBackgroundRecurringJobsScheduler
{
    void ScheduleAll();
    void RemoveAll();
}
