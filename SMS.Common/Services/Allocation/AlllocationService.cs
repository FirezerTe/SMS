using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Common;

public class AllocationService : IAllocationService
{
    private readonly IDataService dataService;

    public AllocationService(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public Allocation AddNewAllocation(CreateAllocationPayload payload)
    {
        var allocation = new Allocation()
        {
            Name = payload.Name,
            Amount = payload.Amount,
            Description = payload.Description,
            FromDate = payload.FromDate ?? DateOnly.FromDateTime(DateTime.Today),
            ToDate = payload.ToDate,
            AllocationRemaining = payload.Amount,
            AllocationPending = 0,
            AllocationReversal = 0,
            AllocationType = payload.AllocationType ?? AllocationType.Bank,
            IsOnlyForExistingShareholders = payload.IsOnlyForExistingShareholders,
            IsDividendAllocation = payload.IsDividendAllocation,
            SubscriptionGroups = payload.IsDividendAllocation ? new List<SubscriptionGroup>() { new() { Name = "Dividend Capitalization", IsDividendCapitalization = true } } : new List<SubscriptionGroup>()
        };

        dataService.Allocations.Add(allocation);
        return allocation;
    }

    public async Task<Allocation> AddNewAllocationAndSaveAsync(CreateAllocationPayload payload,
        CancellationToken cancellationToken = default)
    {
        var allocation = AddNewAllocation(payload);
        await dataService.SaveAsync(cancellationToken);
        return allocation;
    }

    public async Task ComputeAllocationSummaryAsync(int allocationId, CancellationToken? cancellationToken = default)
    {
        await ComputeAllocationSummary(allocationId);
        // if (isSummaryChanged) //TODO: uncomment
        await dataService.SaveAsync(cancellationToken ?? default);
    }

    public async Task ComputeAllocationSummaryForShareholder(int shareholderId, CancellationToken? cancellationToken = null)
    {
        var allocationIds = await dataService.Subscriptions.Where(x => x.ShareholderId == shareholderId).Select(s => s.SubscriptionGroup.AllocationID).Distinct().ToListAsync();

        var isSummaryChanged = false;
        if (allocationIds != null && allocationIds.Count > 0)
        {
            foreach (var allocationId in allocationIds)
            {
                isSummaryChanged = await ComputeAllocationSummary(allocationId);
            }
        }
        await dataService.SaveAsync(cancellationToken ?? default);
    }

    public async Task ComputeAllocationSummaryForPaymentAsync(int paymentId, CancellationToken? cancellationToken = default)
    {
        var allocationId = await dataService.Payments.Where(x => x.Id == paymentId).Select(p => p.Subscription.SubscriptionGroup.AllocationID).FirstOrDefaultAsync();

        await ComputeAllocationSummaryAsync(allocationId, cancellationToken);
    }

    private async Task<bool> ComputeAllocationSummary(int allocationId)
    {
        var subscriptionIds = await dataService.SubscriptionGroups.Where(sg => sg.AllocationID == allocationId)
                                                                  .SelectMany(sg => sg.Subscriptions.Select(x => x.Id))
                                                                  .Distinct().ToListAsync();

        subscriptionIds = subscriptionIds ?? new List<int>();
        bool isSummaryChanged = false;

        var hasApprovedAllocationVersion = await dataService.Allocations.TemporalAll().AnyAsync(a => a.Id == allocationId && a.ApprovalStatus == ApprovalStatus.Approved);

        var approvedPayments = await dataService.SubscriptionPaymentSummaries.Where(s => subscriptionIds.Contains(s.SubscriptionId))
                                                                     .Select(s => s.TotalApprovedPayments)
                                                                     .SumAsync();

        var pendingApprovalPayments = await dataService.SubscriptionPaymentSummaries.Where(s => subscriptionIds.Contains(s.SubscriptionId))
                                                                                    .Select(s => s.TotalPendingApprovalPayments)
                                                                                    .SumAsync();

        var approvedSubscriptionAmount = await dataService.Subscriptions.Where(s => subscriptionIds.Contains(s.Id) && s.ApprovalStatus == ApprovalStatus.Approved)
                                                                           .Select(s => s.Amount)
                                                                           .SumAsync();

        var pendingApprovalSubscriptionAmount = await dataService.Subscriptions.Where(s => subscriptionIds.Contains(s.Id) && s.ApprovalStatus == ApprovalStatus.Submitted)
                                                                                       .Select(s => s.Amount)
                                                                                       .SumAsync();

        var allocationSummary = await dataService.AllocationSubscriptionSummaries.FirstOrDefaultAsync(a => a.AllocationId == allocationId);
        if (allocationSummary == null)
        {
            allocationSummary = new AllocationSubscriptionSummary
            {
                AllocationId = allocationId
            };

            dataService.AllocationSubscriptionSummaries.Add(allocationSummary);
        }

        isSummaryChanged = (subscriptionIds.Count == 0 && hasApprovedAllocationVersion)
                           || allocationSummary.TotalApprovedSubscriptions != approvedSubscriptionAmount
                           || allocationSummary.TotalPendingApprovalSubscriptions != pendingApprovalSubscriptionAmount
                           || allocationSummary.TotalApprovedPayments != approvedPayments
                           || allocationSummary.TotalPendingApprovalPayments != pendingApprovalPayments;

        if (isSummaryChanged)
        {
            allocationSummary.TotalApprovedSubscriptions = approvedSubscriptionAmount;
            allocationSummary.TotalPendingApprovalSubscriptions = pendingApprovalSubscriptionAmount;
            allocationSummary.TotalApprovedPayments = approvedPayments;
            allocationSummary.TotalPendingApprovalPayments = pendingApprovalPayments;
            allocationSummary.AsOf = DateTime.Now;
        }

        return isSummaryChanged;
    }

    public async Task ComputeShareholderAllocations(int allocationId, CancellationToken? cancellationToken)
    {
        var allocation = await dataService.Allocations.TemporalAll().Where(a => a.Id == allocationId)
                                                      .OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd"))
                                                      .FirstOrDefaultAsync();

        if (!(allocation?.IsOnlyForExistingShareholders ?? false) || allocation.Amount == 0) return;

        var shareholderSubscriptionSummaries = await dataService.ShareholderSubscriptionsSummaries.ToListAsync();

        var totalApprovedPayments = shareholderSubscriptionSummaries.Sum(s => s.ApprovedPaymentsAmount);

        if (totalApprovedPayments == 0) return;


        var shareholderIds = shareholderSubscriptionSummaries.Select(s => s.ShareholderId).Distinct().ToList();

        foreach (var shareholderId in shareholderIds)
        {
            var totalShareholderApprovedPayments = shareholderSubscriptionSummaries.Where(s => s.ShareholderId == shareholderId)
                                                                                   .Sum(s => s.ApprovedPaymentsAmount);

            var maxPurchaseLimit = allocation.Amount * totalShareholderApprovedPayments / totalApprovedPayments;

            var shareholderAllocation = await dataService.ShareholderAllocations.FirstOrDefaultAsync(s => s.ShareholderId == shareholderId && s.AllocationId == allocationId);
            if (shareholderAllocation == null)
            {
                shareholderAllocation = new ShareholderAllocation
                {
                    ShareholderId = shareholderId,
                    AllocationId = allocationId
                };
                dataService.ShareholderAllocations.Add(shareholderAllocation);
            }

            shareholderAllocation.MaxPurchaseLimit = maxPurchaseLimit;

        }

        await dataService.SaveAsync(cancellationToken ?? default);
    }

    public async Task<Allocation?> IncrementDividendAllocationAmount(decimal? incrementBy)
    {
        var allocation = await dataService.Allocations.FirstOrDefaultAsync(a => a.IsDividendAllocation);

        if (allocation == null)
        {
            var payload = new CreateAllocationPayload(Amount: incrementBy.Value,
                                                      Name: "Dividend Allocation",
                                                      FromDate: DateOnly.FromDateTime(DateTime.Now),
                                                      ToDate: null,
                                                      Description: null,
                                                      AllocationType: AllocationType.Bank,
                                                      IsOnlyForExistingShareholders: false,
                                                      IsDividendAllocation: true);



            var _allocation = AddNewAllocation(payload);

            return _allocation;
        }

        var approvedAllocation = await dataService.Allocations.TemporalAll()
                                                      .Where(allocation => allocation.IsDividendAllocation && allocation.ApprovalStatus == ApprovalStatus.Approved)
                                                      .OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd"))
                                                      .FirstOrDefaultAsync();

        allocation.Amount = (approvedAllocation == null ? 0 : approvedAllocation.Amount) + incrementBy.Value;


        return allocation;

    }
}
