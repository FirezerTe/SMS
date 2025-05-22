using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application
{
    public record ShareholderSubscriptionsSummary(
        decimal TotalSubscriptions,
        decimal TotalPayments,
        decimal TotalApprovedSubscriptions,
        decimal TotalPendingApprovalSubscriptions,
        decimal TotalApprovedPayments,
        decimal TotalPendingApprovalPayments);
    public record ShareholderSubscriptionsSummaryQuery(int ShareholderId) : IRequest<ShareholderSubscriptionsSummary>;

    public class GetShareholderSubscriptionSummariesQueryHandler : IRequestHandler<ShareholderSubscriptionsSummaryQuery, ShareholderSubscriptionsSummary>
    {
        private readonly IDataService dataService;

        public GetShareholderSubscriptionSummariesQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<ShareholderSubscriptionsSummary> Handle(ShareholderSubscriptionsSummaryQuery request, CancellationToken cancellationToken)
        {
            var paymentSummaries = await dataService.SubscriptionPaymentSummaries.Include(x => x.Subscription)
                                                                          .Where(s => s.Subscription.ShareholderId == request.ShareholderId)
                                                                          .ToListAsync();

            var subscriptionIds = await dataService.Subscriptions.Where(s => s.ShareholderId == request.ShareholderId).Select(s => s.Id).ToListAsync(cancellationToken);

            var subscriptionSummaries = await dataService.ShareholderSubscriptionsSummaries.Where(s => s.ShareholderId == request.ShareholderId).ToListAsync(cancellationToken);


            decimal approvedSubscriptions = 0;
            decimal pendingApprovalSubscriptions = 0;
            decimal approvedPayments = 0;
            decimal pendingApprovalPayments = 0;

            foreach (var summary in paymentSummaries)
            {
                approvedPayments += summary.TotalApprovedPayments;
                pendingApprovalPayments += summary.TotalPendingApprovalPayments;
            }

            foreach (var subscription in subscriptionSummaries)
            {
                approvedSubscriptions += subscription.ApprovedSubscriptionAmount;
                pendingApprovalSubscriptions += subscription.PendingApprovalSubscriptionAmount;
            }



            return new ShareholderSubscriptionsSummary(
                TotalSubscriptions: approvedSubscriptions + pendingApprovalSubscriptions,
                TotalPayments: approvedPayments + pendingApprovalPayments,
                TotalApprovedSubscriptions: approvedSubscriptions,
                TotalPendingApprovalSubscriptions: pendingApprovalSubscriptions,
                TotalApprovedPayments: approvedPayments,
                TotalPendingApprovalPayments: pendingApprovalPayments);
        }
    }
}
