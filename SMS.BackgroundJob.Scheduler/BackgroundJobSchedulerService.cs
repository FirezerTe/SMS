using Hangfire;
using SMS.Common;
using SMS.Common.Services.Posting;
using SMS.Common.Services.RigsWeb;
using System.Linq.Expressions;

namespace SMS.BackgroundJob;


public class BackgroundJobSchedulerService : IBackgroundJobScheduler
{
    private readonly IBackgroundJobClient backgroundJobClient;

    public BackgroundJobSchedulerService(IBackgroundJobClient backgroundJobClient)
    {
        this.backgroundJobClient = backgroundJobClient;
    }

    public string Enqueue(Expression<Action> methodCall)
    {
        return backgroundJobClient.Enqueue(methodCall);
    }

    public string Enqueue<T>(Expression<Action<T>> methodCall)
    {
        return backgroundJobClient.Enqueue<T>(methodCall);
    }

    public string Schedule<T>(Expression<Action<T>> methodCall, TimeSpan delay)
    {
        return backgroundJobClient.Schedule<T>(methodCall, delay);
    }

    public void EnqueueComputeShareholderAllocations(int allocationId)
    {
        Enqueue<IAllocationService>(service => service.ComputeShareholderAllocations(allocationId, default));
    }

    public void EnqueueCreateOrUpdateShares()
    {
        Enqueue<IShareService>(service => service.CreateOrUpdateShares());
    }

    public void EnqueueEmail(int emailId)
    {
        Enqueue<IEmailSenderService>(service => service.Send(emailId));
    }
    public void EnqueueSMS(int smsId)
    {
        Enqueue<ISMSWebService>(service => service.SendSMSMessage(smsId));
    }

    public void EnqueueComputeAllocationSummaryForShareholder(int shareholderId)
    {
        Enqueue<IAllocationService>(service => service.ComputeAllocationSummaryForShareholder(shareholderId, default));
    }


    //Dividend
    public void EnqueueDistributeDividendToShareholders(int dividendSetupId)
    {
        Enqueue<IDividendService>(service => service.DistributeDividendToShareholders(dividendSetupId, default));
    }

    public void EnqueueEodPostUpdate(DateOnly date, List<EndOfDayDto> DailyPostingList)
    {
        Enqueue<IEodService>(service => service.EodPaymentUpdate(date, DailyPostingList));
    }
    public void EnqueueTaxDueDateCompute(int setupId)
    {
        Enqueue<ITaxDuePostingService>(service => service.TaxDueDateComputing(setupId));
    }

    public void EnqueueDividendDecisionCompute(List<int> decisionId)
    {
        Enqueue<IDecisionPostingService>(service => service.DecisionPostingCompute(decisionId));
    }
}
