using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;


public class DividendDecisionSummaryDto
{
    public IEnumerable<DividendDecisionDto> Decisions { get; set; }
    public decimal TotalDividendPayment { get; set; }
    public decimal TotalCapitalizedAmount { get; set; }
    public decimal TotalFulfillmentAmount { get; set; }
    public decimal TotalWithdrawnAmount { get; set; }
    public decimal TotalTaxPaid { get; set; }
    public decimal TotalNetPay { get; set; }
}

public record ShareholderDividendsResult(
    DividendDecisionSummaryDto Approved,
    DividendDecisionSummaryDto Unapproved);

public record GetShareholderDividendsQuery(int ShareholderId) : IRequest<ShareholderDividendsResult?>;

public class GetShareholderDividendsQueryHandler : IRequestHandler<GetShareholderDividendsQuery, ShareholderDividendsResult?>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetShareholderDividendsQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }

    public async Task<ShareholderDividendsResult?> Handle(GetShareholderDividendsQuery request, CancellationToken cancellationToken)
    {
        var decisions = await dataService.DividendDecisions.Where(d => d.Dividend.ShareholderId == request.ShareholderId && d.Dividend.ApprovalStatus == ApprovalStatus.Approved)
                                                           .Include(d => d.Dividend)
                                                           .ThenInclude(d => d.DividendSetup)
                                                           .OrderByDescending(d => d.Dividend.DividendSetup.DividendPeriod.EndDate)
                                                           .ProjectTo<DividendDecisionDto>(mapper.ConfigurationProvider)
                                                           .ToListAsync();

        var unapproved = decisions.Where(d => d.ApprovalStatus != ApprovalStatus.Approved);
        var approved = decisions.Where(decision => !unapproved.Any(d => d.Id == decision.Id));

        return new ShareholderDividendsResult(
             MapToDecisionSummary(approved),
             MapToDecisionSummary(unapproved)
        );

    }

    public DividendDecisionSummaryDto MapToDecisionSummary(IEnumerable<DividendDecisionDto> decisions)
    {

        var totalDividendPayment = decisions.Where(d => d.Dividend?.DividendAmount != null).Sum(d => d.Dividend!.DividendAmount);
        var totalCapitalizedAmount = decisions.Sum(d => d.CapitalizedAmount);
        var totalFulfillmentAmount = decisions.Sum(d => d.FulfillmentPayment);
        var totalWithdrawnAmount = decisions.Sum(d => d.WithdrawnAmount);
        var totalTaxPaid = decisions.Sum(d => d.Tax);
        var totalNetPay = decisions.Sum(d => d.NetPay);

        return new DividendDecisionSummaryDto
        {
            Decisions = decisions,
            TotalDividendPayment = totalDividendPayment,
            TotalCapitalizedAmount = totalCapitalizedAmount,
            TotalFulfillmentAmount = totalFulfillmentAmount,
            TotalWithdrawnAmount = totalWithdrawnAmount,
            TotalTaxPaid = totalTaxPaid,
            TotalNetPay = totalNetPay
        };
    }
}
