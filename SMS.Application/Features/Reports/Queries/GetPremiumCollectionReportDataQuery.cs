using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetPremiumCollectionReportDataQuery : IRequest<PremiumCollectionReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

    public class GetPremiumCollectionReportDataQueryHandler :
        IRequestHandler<GetPremiumCollectionReportDataQuery, PremiumCollectionReportDto>
    {
        private readonly IDataService dataService;

        public GetPremiumCollectionReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<PremiumCollectionReportDto> Handle(GetPremiumCollectionReportDataQuery request, CancellationToken cancellationToken)
        {
            var PremiumReturn = await GetPremiumAsync(request);
            return new PremiumCollectionReportDto
            {
                FromDate = (request.FromDate).ToString("dd MMM yyyy"),
                ToDate = (request.ToDate).ToString("dd MMM yyyy"),
                premiumCollection = await GetPremiumAsync(request),
                TotalPremiumCollect = PremiumReturn?.Sum(a => a.PremiumPayment) ?? 0,
            };
        }

        private async Task<List<PremiumCollectionDto>> GetPremiumAsync(GetPremiumCollectionReportDataQuery request)
        {
            var premiumCollect = new List<PremiumCollectionDto>();
            var premiumCollections = new List<Subscription>();
            var subscriptionList = await dataService.Subscriptions.Where(a => a.ApprovalStatus == ApprovalStatus.Approved).ToListAsync();
            var shareholderList = await dataService.Shareholders.ToListAsync();
            premiumCollections = subscriptionList.Where(a => (request.FromDate == default || DateOnly.FromDateTime(a.SubscriptionDate) >= request.FromDate)
                           && (request.ToDate == default || DateOnly.FromDateTime(a.SubscriptionDate) <= request.ToDate)).ToList();

            for (int i = 0; i < premiumCollections.Count; i++)
            {
                var sequence = i + 1;
                var searchShareholder = shareholderList
                    .Where(a => a.Id == premiumCollections[i].ShareholderId).FirstOrDefault();
                var premium = new PremiumCollectionDto
                {
                    Sequence = sequence,
                    TotalPremium = premiumCollections?.Sum(a => a.PremiumPayment) ?? 0,
                    ShareholderId = premiumCollections[i].ShareholderId,
                    ShareholderName = searchShareholder.Name + " " + searchShareholder.MiddleName,
                    Amount = premiumCollections[i].Amount,
                    SubscriptionDate = (premiumCollections[i].SubscriptionDate.Date).ToString("dd MMMM yyyy"),
                    PremiumPayment = premiumCollections[i].PremiumPayment,
                };
                premiumCollect.Add(premium);
            }

            return premiumCollect;
        }
    }
}