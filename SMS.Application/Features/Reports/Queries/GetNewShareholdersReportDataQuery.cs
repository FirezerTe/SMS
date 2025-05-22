using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application.Features.Reports
{
    public class GetNewShareholdersReportDataQuery : IRequest<ShareholderListReportDto>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
    public class GetNewShareholdersReportDataQueryHandler :
      IRequestHandler<GetNewShareholdersReportDataQuery, ShareholderListReportDto>
    {
        private readonly IDataService dataService;

        public GetNewShareholdersReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<ShareholderListReportDto> Handle(GetNewShareholdersReportDataQuery request, CancellationToken cancellationToken)
        {
            var NewShareholders = new List<ShareholderListDto>();
            var toDate = request.ToDate.AddDays(1);
            NewShareholders = await dataService.Shareholders
                                   .TemporalContainedIn(request.FromDate, toDate)
                                   .OrderBy(sh => EF.Property<DateTime>(sh, "PeriodStart"))
                                   .Where(sh => sh.IsNew == true)
                                   .Select(sh => new ShareholderListDto
                                   {
                                       ShareholderId = sh.ShareholderNumber,
                                       ShareholderName = sh.DisplayName,
                                       RegistrationDate = sh.RegistrationDate.ToString("dd MMMM yyyy"),
                                   })
                                    .Distinct()
                                    .ToListAsync();
            var shareholderSubscriptionSummaryList = await dataService.ShareholderSubscriptionsSummaries.TemporalContainedIn(request.FromDate, toDate).ToListAsync();

            foreach (var Shareholder in NewShareholders)
            {
                var subscriptionSummery = shareholderSubscriptionSummaryList.Where(subs => subs.ShareholderId == Shareholder.ShareholderId).FirstOrDefault();
                var totalSubscriptionAmount = subscriptionSummery.ApprovedSubscriptionAmount;

                Shareholder.TotalPaidUpInBirr = (double)subscriptionSummery.ApprovedPaymentsAmount;
                Shareholder.TotalSubscription = ((double)totalSubscriptionAmount);
            }
            return new ShareholderListReportDto
            {
                Shareholders = NewShareholders
            };
        }
    }
}