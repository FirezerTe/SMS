using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetTopShareholderSubscriptionBasedReportDataQuery : IRequest<TopShareholderSubscriptionBasedListReportDto>
    {
        public int topSubscription { get; set; }
    }

    public class GetTopShareholderSubscriptionBasedReportDataQueryHandler : IRequestHandler<GetTopShareholderSubscriptionBasedReportDataQuery, TopShareholderSubscriptionBasedListReportDto>
    {
        private readonly IDataService dataService;

        public GetTopShareholderSubscriptionBasedReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<TopShareholderSubscriptionBasedListReportDto> Handle(GetTopShareholderSubscriptionBasedReportDataQuery request, CancellationToken cancellationToken)
        {

            return new TopShareholderSubscriptionBasedListReportDto
            {
                TopShareholderSubscriptions = await GetTopSubscriptionAsync(request),
                TopSubscription = request.topSubscription,
            };
        }
        private async Task<List<TopShareholderSubscriptionsDto>> GetTopSubscriptionAsync(GetTopShareholderSubscriptionBasedReportDataQuery request)
        {
            var subscriptions = new List<TopShareholderSubscriptionsDto>();
            var parvalue = await dataService.ParValues.Where(a => a.ApprovalStatus == ApprovalStatus.Approved).FirstOrDefaultAsync();
            var ShareSubscripitonSummary = new List<ShareholderSubscriptionSummary>();
            var shareholderList = await dataService.Shareholders.ToListAsync();
            ShareSubscripitonSummary = await dataService.ShareholderSubscriptionsSummaries
                .OrderByDescending(item => item.ApprovedSubscriptionAmount)
                        .Take(request.topSubscription)
                        .ToListAsync();

            for (int i = 0; i < ShareSubscripitonSummary.Count; i++)
            {
                int Sequence = i + 1;
                var searchShareholder = shareholderList.Where(a => a.Id == ShareSubscripitonSummary[i].ShareholderId).FirstOrDefault();
                var subscription = new TopShareholderSubscriptionsDto
                {
                    SequenceNumber = Sequence,
                    ShareholderName = searchShareholder.DisplayName,
                    ShareholderID = ShareSubscripitonSummary[i].ShareholderId,
                    SubscriptionDate = (ShareSubscripitonSummary[i].CreatedAt.Value.Date).ToString("dd MMMM yyyy"),
                    SubscriptionAmount = ShareSubscripitonSummary[i].ApprovedSubscriptionAmount,
                    Share = (ShareSubscripitonSummary[i].ApprovedSubscriptionAmount) / (parvalue.Amount)
                };
                subscriptions.Add(subscription);
            }
            return subscriptions;
        }
    }
}