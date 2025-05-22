using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public record ShareholderAllocationDto(
    int AllocationId,
    decimal? MaxPurchaseLimit,
    decimal approvedSubscriptionsTotal,
    decimal submittedSubscriptionsTotal,
    decimal approvedPaymentsTotal,
    decimal submittedPaymentsTotal);

public record GetAllShareholderAllocationsQuery(int ShareholderId) : IRequest<List<ShareholderAllocationDto>>;

public class GetAllShareholderAllocationsHandler : IRequestHandler<GetAllShareholderAllocationsQuery, List<ShareholderAllocationDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetAllShareholderAllocationsHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<List<ShareholderAllocationDto>> Handle(GetAllShareholderAllocationsQuery request, CancellationToken cancellationToken)
    {

        var result = new List<ShareholderAllocationDto>();
        var shareholderAllocations = await dataService.ShareholderAllocations.Where(s => s.ShareholderId == request.ShareholderId)
                                                                             //  .ProjectTo<ShareholderAllocationDto>(mapper.ConfigurationProvider)
                                                                             .ToListAsync();

        if (shareholderAllocations.Count == 0) return result;

        var allocationIds = shareholderAllocations.Select(sa => sa.AllocationId).ToList();
        var subscriptionGroups = await dataService.SubscriptionGroups.Where(s => allocationIds.Contains(s.AllocationID)).ToListAsync();
        var subscriptionGroupIds = subscriptionGroups.Select(s => s.Id);


        var approvedOrSubmittedSubscriptions = await dataService.Subscriptions.Where(s => s.ShareholderId == request.ShareholderId
                                                                && (s.ApprovalStatus == ApprovalStatus.Approved || s.ApprovalStatus == ApprovalStatus.Submitted)
                                                                && subscriptionGroupIds.Contains(s.SubscriptionGroupID)).ToListAsync();

        var approvedOrSubmittedSubscriptionIds = approvedOrSubmittedSubscriptions.Select(s => s.Id);

        var approvedOrSubmittedPayments = await dataService.Payments.Where(p =>
                                                approvedOrSubmittedSubscriptionIds.Contains(p.SubscriptionId)
                                                && (p.ApprovalStatus == ApprovalStatus.Approved || p.ApprovalStatus == ApprovalStatus.Submitted)).ToListAsync();

        foreach (var shareholderAllocation in shareholderAllocations)
        {
            var allocationSubscriptionGroupIds = subscriptionGroups.Where(s => s.AllocationID == shareholderAllocation.AllocationId).Select(x => x.Id).ToList();
            var allocationSubscriptions = approvedOrSubmittedSubscriptions.Where(s => allocationSubscriptionGroupIds.Contains(s.SubscriptionGroupID));
            var allocationPayments = approvedOrSubmittedPayments.Where(p => allocationSubscriptions.Any(s => p.SubscriptionId == s.Id));

            var approvedSubscriptionsTotal = allocationSubscriptions.Where(s => s.ApprovalStatus == ApprovalStatus.Approved).Sum(s => s.Amount);
            var submittedSubscriptionsTotal = allocationSubscriptions.Where(s => s.ApprovalStatus == ApprovalStatus.Submitted).Sum(p => p.Amount);

            var approvedPaymentsTotal = allocationPayments.Where(s => s.ApprovalStatus == ApprovalStatus.Approved).Sum(x => x.Amount);
            var submittedPaymentsTotal = allocationPayments.Where(s => s.ApprovalStatus == ApprovalStatus.Submitted).Sum(x => x.Amount);

            result.Add(new ShareholderAllocationDto(
                shareholderAllocation.AllocationId,
                shareholderAllocation.MaxPurchaseLimit,
                approvedSubscriptionsTotal,
                submittedSubscriptionsTotal,
                approvedPaymentsTotal,
                submittedPaymentsTotal));
        }

        return result;
    }
}
