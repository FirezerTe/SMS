using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetShareholderDividendDecisionReportDataQuery : IRequest<ShareholderDividendDecisionReportDto>
    {
        public int shareholderId { get; set; }
    }

    public class GetShareholderDividendDecisionReportDataQueryHandler :
        IRequestHandler<GetShareholderDividendDecisionReportDataQuery, ShareholderDividendDecisionReportDto>
    {
        private readonly IDataService dataService;

        public GetShareholderDividendDecisionReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<ShareholderDividendDecisionReportDto> Handle(GetShareholderDividendDecisionReportDataQuery request, CancellationToken cancellationToken)
        {
            var dividendDecisionList = await GetShareholderDecisionAsync(request);
            return new ShareholderDividendDecisionReportDto
            {
                totalCapitalizedAmount = Math.Round(dividendDecisionList.Sum(x => x.capitalisedAmount), 2),
                totalWithdrawAmount = Math.Round(dividendDecisionList.Sum(y => y.withdrawnAmount), 2),
                totalTax = dividendDecisionList.Sum(t => t.Tax),
                DividendDecisions = dividendDecisionList
            };
        }

        private async Task<List<ShareholderDividendDecisionDTO>> GetShareholderDecisionAsync(GetShareholderDividendDecisionReportDataQuery request)
        {
            var dividendDecision = new List<ShareholderDividendDecisionDTO>();
            var dividendDecisions = await dataService.DividendDecisions.Include(dv => dv.Dividend)
               .Where(dv => dv.Dividend.ShareholderId == request.shareholderId
               && dv.ApprovalStatus == ApprovalStatus.Approved && dv.DecisionProcessed == true).ToListAsync();
            var shareholderInfo = dataService.Shareholders.Where(sh => sh.Id == request.shareholderId).FirstOrDefault();

            foreach (var div in dividendDecisions)
            {
                var shareholderDecision = new ShareholderDividendDecisionDTO
                {
                    ShareholderId = div.Dividend.ShareholderId,
                    ShareholderName = shareholderInfo.DisplayName,
                    DecisionDate = (DateOnly)div.DecisionDate,
                    DecisionType = div.Decision.ToString(),
                    capitalisedAmount = div.CapitalizedAmount,
                    withdrawnAmount = div.WithdrawnAmount,
                    fulfillmentAmount = div.FulfillmentPayment,
                    netPay = div.NetPay,
                    Tax = div.Tax,

                };
                dividendDecision.Add(shareholderDecision);
            }

            return dividendDecision;
        }
    }
}
