using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application
{

    public record UnapprovedPayment(int Id, int SubscriptionId, ApprovalStatus status);
    public record ShareholderSubscriptions(
       List<ShareholderSubscriptionDto> Approved,
       List<ShareholderSubscriptionDto> Submitted,
       List<ShareholderSubscriptionDto> Rejected,
       List<ShareholderSubscriptionDto> Draft,
       List<UnapprovedPayment> UnapprovedPayments);

    public record GetShareholderSubscriptionsQuery(int ShareholderId) : IRequest<ShareholderSubscriptions>;

    public class GetShareholderSubscriptionsQueryHandler
        : IRequestHandler<GetShareholderSubscriptionsQuery, ShareholderSubscriptions>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetShareholderSubscriptionsQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<ShareholderSubscriptions> Handle(GetShareholderSubscriptionsQuery request, CancellationToken cancellationToken)
        {
            var subscriptions = await dataService.Subscriptions.TemporalAll()
                .Where(s => s.ShareholderId == request.ShareholderId)
                .OrderByDescending(s => s.SubscriptionDate)
                .ProjectTo<ShareholderSubscriptionDto>(mapper.ConfigurationProvider)
                .ToListAsync();

            var uniqueSubscriptionIds = subscriptions.Select(s => s.Id).Distinct().ToList();

            var subscriptionPaymentSummaries = await dataService.SubscriptionPaymentSummaries
                 .Where(summary => uniqueSubscriptionIds.Contains(summary.SubscriptionId))
                 .ProjectTo<SubscriptionPaymentSummaryDto>(mapper.ConfigurationProvider)
                 .ToListAsync();

            foreach (var subscription in subscriptions)
                subscription.PaymentSummary = subscriptionPaymentSummaries.FirstOrDefault(summary => summary.SubscriptionId == subscription.Id);


            var draft = subscriptions
                .Where(s => s.ApprovalStatus == ApprovalStatus.Draft &&
                s.PeriodEnd > DateTime.UtcNow).ToList();

            var submitted = subscriptions
                .Where(s => s.ApprovalStatus == ApprovalStatus.Submitted &&
                s.PeriodEnd > DateTime.UtcNow).ToList();

            var approved = subscriptions
                .Where(s => s.ApprovalStatus == ApprovalStatus.Approved)
                .OrderByDescending(s => s.PeriodEnd)
                .GroupBy(s => new { s.Id })
                .Select(grp => grp.FirstOrDefault())
                .Where(p => p != null).ToList();

            var rejected = subscriptions
                .Where(p => p.ApprovalStatus == ApprovalStatus.Rejected &&
                (
                    !approved.Any(l => l.Id == p.Id) ||
                    !approved.Any(l => l.Id == p.Id && l.PeriodStart > p.PeriodEnd))
                )
                .ToList();


            var unapprovedPayments = await dataService.Payments
                .Where(p => uniqueSubscriptionIds.Contains(p.Id) && p.ApprovalStatus != ApprovalStatus.Approved)
                .Select(p => new UnapprovedPayment(p.Id, p.SubscriptionId, p.ApprovalStatus)).ToListAsync();


            return new ShareholderSubscriptions(
                Approved: approved,
                Submitted: submitted,
                Rejected: rejected,
                Draft: draft,
                UnapprovedPayments: unapprovedPayments);
        }
    }
}
