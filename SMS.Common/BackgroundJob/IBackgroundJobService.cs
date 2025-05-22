using SMS.Common.Services.RigsWeb;

namespace SMS.Common;

public interface IBackgroundJobScheduler
{
    void EnqueueComputeAllocationSummaryForShareholder(int shareholderId);
    void EnqueueComputeShareholderAllocations(int allocationId);
    void EnqueueEmail(int emailId);
    void EnqueueSMS(int smsId);
    void EnqueueCreateOrUpdateShares();
    void EnqueueDistributeDividendToShareholders(int dividendSetupId);
    void EnqueueEodPostUpdate(DateOnly date, List<EndOfDayDto> DailyPostingList);
    void EnqueueTaxDueDateCompute(int setupId);
    void EnqueueDividendDecisionCompute(List<int> setupId);
}
