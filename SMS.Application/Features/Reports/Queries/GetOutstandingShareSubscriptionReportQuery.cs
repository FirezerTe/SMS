using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetOutstandingShareSubscriptionReportQuery : IRequest<OutstandingShareSubscriptionReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

    public class GetOutstandingShareSubscriptionReportQueryHandler : IRequestHandler<GetOutstandingShareSubscriptionReportQuery, OutstandingShareSubscriptionReportDto>
    {
        private readonly IDataService dataService;

        public GetOutstandingShareSubscriptionReportQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<OutstandingShareSubscriptionReportDto> Handle(GetOutstandingShareSubscriptionReportQuery request, CancellationToken cancellationToken)
        {
            var OutstandingReturned = await GetOutstandingSubscriptionAsync(request);

            return new OutstandingShareSubscriptionReportDto
            {
                FromDate = request.FromDate.ToString("dd MMMM yyyy"),
                ToDate = request.ToDate.ToString("dd MMMM yyyy"),
                OutstandingShareSubscriptions = await GetOutstandingSubscriptionAsync(request),
                TotalOutstandingSubscription = OutstandingReturned.Sum(a => a.SubscriptionOutstandingAmount),
            };
        }
        private async Task<List<OutstandingShareSubscriptionDto>> GetOutstandingSubscriptionAsync(GetOutstandingShareSubscriptionReportQuery request)
        {
            var subscriptions = new List<OutstandingShareSubscriptionDto>();
            var ShareSubscripitonSummary = new List<ShareholderSubscriptionSummary>();
            var subscriptionSummaryList = await dataService.ShareholderSubscriptionsSummaries.ToListAsync();
            var shareholdersList = await dataService.Shareholders.ToListAsync();

            ShareSubscripitonSummary = subscriptionSummaryList
                .Where(a => (request.FromDate == default && request.ToDate == default)
                || (DateOnly.FromDateTime(a.CreatedAt.Value.Date) >= request.FromDate && DateOnly.FromDateTime(a.CreatedAt.Value.Date) <= request.ToDate))
                .ToList();

            List<decimal> OutstandingSubscriptionList = new List<decimal>();

            foreach (var subscription in ShareSubscripitonSummary)
            {
                var OutstandingSubscription = subscription.ApprovedSubscriptionAmount - subscription.ApprovedPaymentsAmount;
                OutstandingSubscriptionList.Add(OutstandingSubscription);

            }
            var TotalOutstandingSubscription = OutstandingSubscriptionList.Sum();
            for (int i = 0; i < ShareSubscripitonSummary.Count; i++)
            {
                var sequence = i + 1;
                var searchShareholder = shareholdersList.Where(a => a.Id == ShareSubscripitonSummary[i].ShareholderId).FirstOrDefault();
                var subscription = new OutstandingShareSubscriptionDto
                {
                    sequence = sequence,
                    ShareholderName = searchShareholder.DisplayName,
                    ShareholderID = ShareSubscripitonSummary[i].ShareholderId,
                    SubscriptionDate = (ShareSubscripitonSummary[i].CreatedAt.Value.Date).ToString("dd MMMM yyyy"),
                    SubscriptionAmount = ShareSubscripitonSummary[i].ApprovedSubscriptionAmount,
                    SubscriptionOutstandingAmount = (ShareSubscripitonSummary[i].ApprovedSubscriptionAmount) - (ShareSubscripitonSummary[i].ApprovedPaymentsAmount),
                    SubscriptionPaidUpAmount = ShareSubscripitonSummary[i].ApprovedPaymentsAmount,

                };

                if (subscription.SubscriptionOutstandingAmount > 0)
                {
                    subscriptions.Add(subscription);
                }

            }
            return subscriptions;
        }
    }
}