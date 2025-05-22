using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;


namespace SMS.Application.Features.Reports
{
    public class GetSubscriptionsReportDataQuery : IRequest<SubscriptionsReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
        public int ShareholderId { get; set; }
    }

    public class GetSubscriptionsReportDataQueryHandler :
        IRequestHandler<GetSubscriptionsReportDataQuery, SubscriptionsReportDto>
    {
        private readonly IDataService dataService;

        public GetSubscriptionsReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<SubscriptionsReportDto> Handle(GetSubscriptionsReportDataQuery request, CancellationToken cancellationToken)
        {
            return new SubscriptionsReportDto
            {
                FromDate = request.FromDate.ToString("dd MMMM yyyy"),
                ToDate = request.ToDate.ToString("dd MMMM yyyy"),
                Subscriptions = await GetSubscriptionsAsync(request),
                ShareholderId = request.ShareholderId
            };
        }

        private async Task<List<SubscriptionDto>> GetSubscriptionsAsync(GetSubscriptionsReportDataQuery request)
        {
            var subscriptions = new List<SubscriptionDto>();
            var shareholderSubscriptions = new List<Subscription>();
            var subscriptionList = await dataService.Subscriptions.Where(a => a.ApprovalStatus == ApprovalStatus.Approved).ToListAsync();
            var shareholderList = await dataService.Shareholders.ToListAsync();
            var subscriptionGroupList = await dataService.SubscriptionGroups.ToListAsync();
            var parvalue = await dataService.ParValues.Where(a => a.ApprovalStatus == ApprovalStatus.Approved).FirstOrDefaultAsync();
            shareholderSubscriptions = subscriptionList
                                      .Where(a => (request.ShareholderId == 0 || a.ShareholderId == request.ShareholderId)
                                                    && (request.FromDate == default || request.ToDate == default
                                                    || (DateOnly.FromDateTime(a.SubscriptionDate) >= request.FromDate
                                                    && DateOnly.FromDateTime(a.SubscriptionDate) <= request.ToDate)))
                                     .ToList();

            for (int i = 0; i < shareholderSubscriptions.Count; i++)
            {
                int sequence = i + 1;
                var searchShareholder = shareholderList
                    .Where(a => a.Id == shareholderSubscriptions[i].ShareholderId).FirstOrDefault();
                var searchSubscriptionGroup = subscriptionGroupList
                .Where(a => a.Id == shareholderSubscriptions[i].SubscriptionGroupID).FirstOrDefault();
                var subscription = new SubscriptionDto
                {

                    SequenceNumber = sequence,
                    ShareholderId = shareholderSubscriptions[i].ShareholderId,
                    ShareholderName = searchShareholder.DisplayName,
                    SubscriptionOriginalReferenceNo = shareholderSubscriptions[i].SubscriptionOriginalReferenceNo,
                    SubscriptionGroup = searchSubscriptionGroup.Name,
                    Amount = shareholderSubscriptions[i].Amount,
                    Share = (shareholderSubscriptions[i].Amount) / (parvalue.Amount),
                    SubscriptionDate = (shareholderSubscriptions[i].SubscriptionDate.Date).ToString("dd MMMM yyyy"),
                    WorkflowComment = shareholderSubscriptions[i].WorkflowComment,
                    PremiumPaymentReceiptNo = shareholderSubscriptions[i].PremiumPaymentReceiptNo,
                    PremiumPayment = shareholderSubscriptions[i].PremiumPayment,
                };
                subscriptions.Add(subscription);
            }

            return subscriptions;
        }
    }
}