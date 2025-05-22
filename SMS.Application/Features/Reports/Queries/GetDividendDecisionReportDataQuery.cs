using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetDividendDecisionReportDataQuery : IRequest<DividendDecisionReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

    public class GetDividendDecisionReportDataQueryHandler :
        IRequestHandler<GetDividendDecisionReportDataQuery, DividendDecisionReportDto>
    {
        private readonly IDataService dataService;

        public GetDividendDecisionReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<DividendDecisionReportDto> Handle(GetDividendDecisionReportDataQuery request, CancellationToken cancellationToken)
        {
            var dividendDecisionList = await GetDividendDecision(request);
            return new DividendDecisionReportDto
            {
                toDate = request.ToDate,
                fromDate = request.FromDate,
                totalDividendAmount = dividendDecisionList.Sum(amt => amt.DividendAmount),
                totalCapitalizedAmount = dividendDecisionList.Sum(x => x.CapitalisedAmount),
                totalWithdrawAmount = dividendDecisionList.Sum(y => y.WithdrawnAmount),
                totalTax = dividendDecisionList.Sum(t => t.Tax),
                dividendDecisions = dividendDecisionList
            };
        }

        private async Task<List<DividendDecisionDTO>> GetDividendDecision(GetDividendDecisionReportDataQuery request)
        {
            var dividendDecision = new List<DividendDecisionDTO>();
            var dividendDecisions = await dataService.DividendDecisions.Include(dv => dv.Dividend)
                .Where(dv => dv.DecisionDate > request.FromDate && dv.DecisionDate < request.ToDate.AddDays(1)
                && dv.ApprovalStatus == ApprovalStatus.Approved && dv.DecisionProcessed == true).ToListAsync();
            var shareholderList = dataService.Shareholders.Select(x => new { x.Id, x.ShareholderNumber, x.DisplayName });

            foreach (var div in dividendDecisions)
            {
                var shareholderInfo = shareholderList.Where(sh => sh.Id == div.Dividend.ShareholderId).FirstOrDefault();
                var decision = new DividendDecisionDTO
                {
                    ShareholderId = shareholderInfo.ShareholderNumber,
                    ShareholderName = shareholderInfo.DisplayName,
                    DecisionDate = (DateOnly)div.DecisionDate,
                    DecisionType = div.Decision.ToString(),
                    CapitalisedAmount = Math.Round(div.CapitalizedAmount, 2),
                    WithdrawnAmount = Math.Round(div.WithdrawnAmount, 2),
                    DividendAmount = Math.Round(div.Dividend.DividendAmount, 2),
                    FulfillmentAmount = Math.Round(div.FulfillmentPayment, 2),
                    Tax = Math.Round(div.Tax, 2),
                };
                dividendDecision.Add(decision);
            }

            return dividendDecision;
        }
    }
}
