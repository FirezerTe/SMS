using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Common;

public class ShareholderSummaryService : IShareholderSummaryService
{
    private readonly IDataService dataService;
    private readonly IAllocationService allocationService;
    private readonly IBackgroundJobScheduler backgroundJobService;

    public ShareholderSummaryService(IDataService dataService, IAllocationService allocationService, IBackgroundJobScheduler backgroundJobService)
    {
        this.dataService = dataService;
        this.allocationService = allocationService;
        this.backgroundJobService = backgroundJobService;
    }
    public async Task<bool> ComputeShareholderSummaries(int shareholderId, bool computeAllocationSummary, CancellationToken cancellationToken)
    {
        var shareholderSubscriptionSummaryChanged = false;
        var paymentSummaryChanged = false;

        var shareholderSubscriptions = await dataService.Subscriptions.Where(s => s.ShareholderId == shareholderId).ToListAsync(cancellationToken);
        var shareholderSubscriptionIds = shareholderSubscriptions.Select(s => s.Id);


        //Approved payments
        var approvedPayments = await GetApprovedPayments(shareholderSubscriptionIds, cancellationToken);
        var approvedPaymentsAmount = approvedPayments.Sum(x => x?.Amount ?? 0);

        //Pending approval payments
        var pendingApprovalPayments = await GetPendingApprovalPayments(shareholderSubscriptionIds, cancellationToken);
        var pendingApprovalPaymentsAmount = pendingApprovalPayments.Sum(p => p.Amount);

        var approvedSubscriptions = await GetApprovedSubscriptions(shareholderId, cancellationToken);
        var approvedSubscriptionsAmount = approvedSubscriptions.Where(x => x != null).Sum(x => x?.Amount ?? 0);


        var pendingApprovalSubscriptionAmount = shareholderSubscriptions.Where(s => s.ApprovalStatus == ApprovalStatus.Submitted).Sum(p => p.Amount);


        var shareholderSummary = await dataService.ShareholderSubscriptionsSummaries.FirstOrDefaultAsync(s => s.ShareholderId == shareholderId,
                                                                                                         cancellationToken: cancellationToken);
        if (shareholderSummary == null)
        {
            shareholderSummary = new ShareholderSubscriptionSummary()
            {
                ShareholderId = shareholderId
            };
            dataService.ShareholderSubscriptionsSummaries.Add(shareholderSummary);
        }

        shareholderSubscriptionSummaryChanged = shareholderSummary.ApprovedPaymentsAmount != approvedPaymentsAmount
                                                    || shareholderSummary.PendingApprovalPaymentsAmount != pendingApprovalPaymentsAmount
                                                    || shareholderSummary.ApprovedSubscriptionAmount != approvedSubscriptionsAmount
                                                    || shareholderSummary.PendingApprovalSubscriptionAmount != pendingApprovalSubscriptionAmount;

        if (shareholderSubscriptionSummaryChanged)
        {
            shareholderSummary.ApprovedPaymentsAmount = approvedPaymentsAmount;
            shareholderSummary.PendingApprovalPaymentsAmount = pendingApprovalPaymentsAmount;
            shareholderSummary.ApprovedSubscriptionAmount = approvedSubscriptionsAmount;
            shareholderSummary.PendingApprovalSubscriptionAmount = pendingApprovalSubscriptionAmount;
            shareholderSummary.AsOf = DateTime.Now;
        }

        var subscriptionPaymentSummaries = dataService.SubscriptionPaymentSummaries.Where(s => shareholderSubscriptionIds.Contains(s.SubscriptionId)).ToList();

        foreach (var subscription in shareholderSubscriptions)
        {
            var subscriptionSummary = subscriptionPaymentSummaries.FirstOrDefault(s => s.SubscriptionId == subscription.Id);
            if (subscriptionSummary == null)
            {
                subscriptionSummary = new SubscriptionPaymentSummary
                {
                    SubscriptionId = subscription.Id
                };

                dataService.SubscriptionPaymentSummaries.Add(subscriptionSummary);
            }

            var pendingPayments = pendingApprovalPayments.Where(p => p.SubscriptionId == subscription.Id).Sum(x => x.Amount);
            var approvedSubscriptionPayment = approvedPayments.Where(p => p?.SubscriptionId == subscription.Id).Sum(x => x?.Amount ?? 0);

            var updated = pendingPayments != subscriptionSummary.TotalPendingApprovalPayments
                          || approvedSubscriptionPayment != subscriptionSummary.TotalApprovedPayments;

            if (updated)
            {
                subscriptionSummary.TotalPendingApprovalPayments = pendingPayments;
                subscriptionSummary.TotalApprovedPayments = approvedSubscriptionPayment;
                subscriptionSummary.AsOf = DateTime.Now;
            }
            paymentSummaryChanged = paymentSummaryChanged || updated;
        }

        var hasChange = paymentSummaryChanged || shareholderSubscriptionSummaryChanged;
        if (hasChange)
        {
            await dataService.SaveAsync(cancellationToken);
            if (computeAllocationSummary)
                backgroundJobService.EnqueueComputeAllocationSummaryForShareholder(shareholderId);
        }

        return hasChange;

    }

    public async Task ComputeAllShareholdersSummary(CancellationToken cancellationToken)
    {
        var shareholderIds = await dataService.Shareholders.Select(s => s.Id).ToListAsync();

        foreach (var shareholderId in shareholderIds)
        {
            await ComputeShareholderSummaries(shareholderId, false, cancellationToken);
        }

        var allocationIds = await dataService.Allocations.Select(s => s.Id).ToListAsync();
        foreach (var allocationId in allocationIds)
        {
            await allocationService.ComputeAllocationSummaryAsync(allocationId, cancellationToken);
        }
    }


    private async Task<List<Subscription?>> GetApprovedSubscriptions(int shareholderId, CancellationToken cancellationToken)
    {
        return await dataService.Subscriptions.TemporalAll()
                                                 .Where(s => s.ApprovalStatus == ApprovalStatus.Approved && s.ShareholderId == shareholderId)
                                                 .GroupBy(p => new { p.Id })
                                                 .Select(group => group.OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd")).FirstOrDefault())
                                                 .ToListAsync(cancellationToken: cancellationToken);
    }

    private async Task<List<Payment>> GetPendingApprovalPayments(IEnumerable<int> subscriptionIds, CancellationToken cancellationToken)
    {
        return await dataService.Payments.Where(p => p.ApprovalStatus == ApprovalStatus.Submitted
                                                        && subscriptionIds.Contains(p.SubscriptionId))
                                            .ToListAsync(cancellationToken: cancellationToken);
    }

    private async Task<List<Payment?>> GetApprovedPayments(IEnumerable<int> subscriptionIds, CancellationToken cancellationToken)
    {
        var approvedPayments = await dataService.Payments.TemporalAll()
                                                            .Where(p => p.ApprovalStatus == ApprovalStatus.Approved && subscriptionIds.Contains(p.SubscriptionId))
                                                            .GroupBy(p => new { p.Id })
                                                            .Select(group => group.OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd")).FirstOrDefault())
                                                            .ToListAsync(cancellationToken: cancellationToken);

        return approvedPayments.Where(p => p != null && p.EffectiveDate <= DateTime.Now && (p.EndDate == null || p.EndDate > DateTime.Now)).ToList();
    }
}
