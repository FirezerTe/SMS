using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public record DividendDecisionsSummary(int SetupId, decimal TotalAmount);

public record GetDividendDecisionsSummaryQueryResult(List<DividendDecisionsSummary> Pending,
                                            decimal PendingTotal,
                                            List<DividendDecisionsSummary> Approved,
                                            decimal ApprovedTotal,
                                            List<DividendDecisionsSummary> Submitted,
                                            decimal SubmittedTotal,
                                            List<DividendDecisionsSummary> Draft,
                                            decimal DraftTotal);


public record GetDividendDecisionsSummaryQuery() : IRequest<GetDividendDecisionsSummaryQueryResult>;

public class GetDividendDecisionsSummaryQueryHandler : IRequestHandler<GetDividendDecisionsSummaryQuery, GetDividendDecisionsSummaryQueryResult>
{
    private readonly IDataService dataService;

    public GetDividendDecisionsSummaryQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<GetDividendDecisionsSummaryQueryResult> Handle(GetDividendDecisionsSummaryQuery request, CancellationToken cancellationToken)
    {
        var _pendingDividendSummary = await dataService.DividendDecisions.Where(d => d.Decision == DividendDecisionType.Pending).GroupBy(d => d.Dividend.DividendSetupId).Select(grp => new
        {
            SetupId = grp.Key,
            Amount = grp.Sum(x => x.Dividend.DividendAmount - x.Tax)
        })
        .ToListAsync();

        var _approvedDividendSummary = await dataService.DividendDecisions.Where(d => d.Decision != DividendDecisionType.Pending && d.ApprovalStatus == ApprovalStatus.Approved).GroupBy(d => d.Dividend.DividendSetupId).Select(grp => new
        {
            SetupId = grp.Key,
            Amount = grp.Sum(x => x.Dividend.DividendAmount - x.Tax)
        })
       .ToListAsync();

        var _submittedDividendSummary = await dataService.DividendDecisions.Where(d => d.Decision != DividendDecisionType.Pending && d.ApprovalStatus == ApprovalStatus.Submitted).GroupBy(d => d.Dividend.DividendSetupId).Select(grp => new
        {
            SetupId = grp.Key,
            Amount = grp.Sum(x => x.Dividend.DividendAmount - x.Tax)
        })
        .ToListAsync();

        var _draftDividendSummary = await dataService.DividendDecisions.Where(d => d.Decision != DividendDecisionType.Pending && d.ApprovalStatus == ApprovalStatus.Draft).GroupBy(d => d.Dividend.DividendSetupId).Select(grp => new
        {
            SetupId = grp.Key,
            Amount = grp.Sum(x => x.Dividend.DividendAmount - x.Tax)
        })
        .ToListAsync();

        var pendingDecisions = _pendingDividendSummary.Where(d => d.Amount > 0).Select(d => new DividendDecisionsSummary(d.SetupId, d.Amount)).ToList();
        var pendingTotal = pendingDecisions.Sum(x => x.TotalAmount);

        var approvedDecisions = _approvedDividendSummary.Where(d => d.Amount > 0).Select(d => new DividendDecisionsSummary(d.SetupId, d.Amount)).ToList();
        var approvedTotal = approvedDecisions.Sum(x => x.TotalAmount);


        var submittedDecisions = _submittedDividendSummary.Where(d => d.Amount > 0).Select(d => new DividendDecisionsSummary(d.SetupId, d.Amount)).ToList();
        var submittedTotal = submittedDecisions.Sum(x => x.TotalAmount);

        var draftDecisions = _draftDividendSummary.Where(d => d.Amount > 0).Select(d => new DividendDecisionsSummary(d.SetupId, d.Amount)).ToList();
        var draftTotal = draftDecisions.Sum(x => x.TotalAmount);

        return new GetDividendDecisionsSummaryQueryResult(Pending: pendingDecisions,
                                                          PendingTotal: pendingTotal,
                                                          Approved: approvedDecisions,
                                                          ApprovedTotal: approvedTotal,
                                                          Submitted: submittedDecisions,
                                                          SubmittedTotal: submittedTotal,
                                                          Draft: draftDecisions,
                                                          DraftTotal: draftTotal);
    }
}
