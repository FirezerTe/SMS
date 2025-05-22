using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetUncollectedDividendReportDataQuery : IRequest<UncollectedDividendReportDto>
    {
        public int Shareholderid { get; set; }
    }

    public class GetUncollectedDividendReportDataQueryHandler :
        IRequestHandler<GetUncollectedDividendReportDataQuery, UncollectedDividendReportDto>
    {
        private readonly IDataService dataService;

        public GetUncollectedDividendReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<UncollectedDividendReportDto> Handle(GetUncollectedDividendReportDataQuery request, CancellationToken cancellationToken)
        {
            var uncollectedDividendList = await GetUncollectedAsync(request);
            return new UncollectedDividendReportDto
            {
                TotalUncollected = Math.Round(uncollectedDividendList.Sum(x => x.amount), 2),
                TotalTax = Math.Round(uncollectedDividendList.Sum(x => x.Tax), 2),
                UncollectedDividend = uncollectedDividendList,
            };
        }

        private async Task<List<UncollectedDividendDTO>> GetUncollectedAsync(GetUncollectedDividendReportDataQuery request)
        {
            var dividendUncollected = new List<UncollectedDividendDTO>();
            var dividend = new List<DividendDecision>();
            var uncollectedDividends = await dataService.DividendDecisions.Include(dv => dv.Dividend.DividendSetup.DividendPeriod)
                .Where(dv => dv.Dividend.ShareholderId == request.Shareholderid
                && dv.TaxApplied == true && dv.DecisionProcessed == false).ToListAsync();
            var shareholderInfo = dataService.Shareholders.Where(sh => sh.Id == request.Shareholderid).FirstOrDefault();


            foreach (var divi in uncollectedDividends)
            {
                var div = new UncollectedDividendDTO
                {
                    ShareholderId = divi.Dividend.ShareholderId,
                    ShareholderName = shareholderInfo.DisplayName,
                    amount = Math.Round(divi.Dividend.DividendAmount, 2),
                    fiscalYear = divi.Dividend.DividendSetup.DividendPeriod.Year,
                    Tax = Math.Round(divi.Tax, 2)

                };
                dividendUncollected.Add(div);
            }

            return dividendUncollected;
        }
    }
}
