using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetExpiredShareSubscriptionReportDataQuery : IRequest<ExpiredShareSubscriptionReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
        public int ShareholderId { get; set; }
    }

    public class GetExpiredShareSubscriptionReportDataQueryHandler :
        IRequestHandler<GetExpiredShareSubscriptionReportDataQuery, ExpiredShareSubscriptionReportDto>
    {
        private readonly IDataService dataService;

        public GetExpiredShareSubscriptionReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<ExpiredShareSubscriptionReportDto> Handle(GetExpiredShareSubscriptionReportDataQuery request, CancellationToken cancellationToken)
        {
            var TotalExpiredAmount = await GetExpiredSubscriptionsAsync(request);
            return new ExpiredShareSubscriptionReportDto
            {
                FromDate = request.FromDate.ToString("dd MMMM yyyy"),
                ToDate = request.ToDate.ToString("dd MMMM yyyy"),
                ExpiredSubscriptions = await GetExpiredSubscriptionsAsync(request),
                ShareholderId = request.ShareholderId,
                TotalExpiredAmount = TotalExpiredAmount.Sum(x => x.ExpiredAmount)
            };
        }

        private async Task<List<ExpiredShareSubscriptionDto>> GetExpiredSubscriptionsAsync(GetExpiredShareSubscriptionReportDataQuery request)
        {
            var subscriptions = new List<ExpiredShareSubscriptionDto>();
            var shareholderSubscriptions = new List<Subscription>();
            var subscriptionList = await dataService.Subscriptions.Where(a => a.ApprovalStatus == ApprovalStatus.Approved).ToListAsync();
            var shareholderList = await dataService.Shareholders.ToListAsync();
            var subscriptionGroupList = await dataService.SubscriptionGroups.ToListAsync();
            var paymentList = await dataService.Payments.Where(a => a.ApprovalStatus == ApprovalStatus.Approved).ToListAsync();
            shareholderSubscriptions = subscriptionList
                                      .Where(a => (request.ShareholderId == 0 || a.ShareholderId == request.ShareholderId)
                                            && (request.FromDate == default || DateOnly.FromDateTime(a.SubscriptionDate) >= request.FromDate)
                                            && (request.ToDate == default || DateOnly.FromDateTime(a.SubscriptionDate) <= request.ToDate)
                                            && a.SubscriptionPaymentDueDate < DateOnly.FromDateTime(DateTime.UtcNow))
                                      .ToList();


            for (int i = 0; i < shareholderSubscriptions.Count; i++)
            {
                var sequence = i + 1;
                var searchPayment = paymentList
                   .Where(a => a.SubscriptionId == shareholderSubscriptions[i].Id).ToList();
                var TotalPayment = searchPayment.Sum(a => a.Amount);
                var Compute = (shareholderSubscriptions[i].Amount) - TotalPayment;
                var searchShareholder = shareholderList
                     .Where(a => a.Id == shareholderSubscriptions[i].ShareholderId).FirstOrDefault();
                var searchSubscriptionGroup = subscriptionGroupList
                .Where(a => a.Id == shareholderSubscriptions[i].SubscriptionGroupID).FirstOrDefault();
                var subscription = new ExpiredShareSubscriptionDto
                {
                    sequence = sequence,
                    ExpiredAmount = Compute,
                    TotalPayment = TotalPayment,
                    ShareholderId = shareholderSubscriptions[i].ShareholderId,
                    ShareholderName = searchShareholder.Name + " " + searchShareholder.MiddleName,
                    SubscriptionOriginalReferenceNo = shareholderSubscriptions[i].SubscriptionOriginalReferenceNo,
                    SubscriptionGroup = searchSubscriptionGroup.Name,
                    Amount = shareholderSubscriptions[i].Amount,
                    SubscriptionDate = (shareholderSubscriptions[i].SubscriptionDate.Date).ToString("dd MMMM yyyy"),
                    DueDate = (shareholderSubscriptions[i].SubscriptionPaymentDueDate).ToString("dd MMMM yyyy"),
                    WorkflowComment = shareholderSubscriptions[i].WorkflowComment,
                    PremiumPaymentReceiptNo = shareholderSubscriptions[i].PremiumPaymentReceiptNo,

                };
                if (Compute != 0)
                    subscriptions.Add(subscription);
            }

            return subscriptions;
        }
    }
}