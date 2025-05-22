using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record SaveDividendDecisionCommand(List<int> decisionIds,
                                          decimal amountToCapitalize,
                                          DateOnly DecisionDate,
                                          int? BranchId,
                                          int? DistrictId,
                                          decimal AdditionalSharesWillingToBuy) : IRequest;

public class SaveDividendDecisionCommandHandler : IRequestHandler<SaveDividendDecisionCommand>
{
    private readonly IDataService dataService;
    private readonly IDividendService dividendService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public SaveDividendDecisionCommandHandler(IDataService dataService, IDividendService dividendService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.dividendService = dividendService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }
    public async Task Handle(SaveDividendDecisionCommand request, CancellationToken cancellationToken)
    {
        var dividendDecisions = await dataService.DividendDecisions.Include(d => d.Dividend).Where(d => request.decisionIds.Contains(d.Id) && d.ApprovalStatus != Domain.Enums.ApprovalStatus.Approved).ToListAsync();

        var result = await dividendService.ComputeDividendDecision(dividendDecisions.Select(d => d.Id).ToList(), request.amountToCapitalize);

        if (result == null || result.Results.Count == 0) return;

        var index = 0;

        foreach (var decision in result.Results)
        {
            var d = dividendDecisions.FirstOrDefault(d => decision.Id == d.Id);
            if (d == null) continue;

            d.Decision = decision.Decision;
            d.CapitalizedAmount = decision.CapitalizedAmount;
            d.FulfillmentPayment = decision.FulfillmentAmount;
            d.WithdrawnAmount = decision.WithdrawnAmount;
            d.DecisionDate = request.DecisionDate;
            d.DistrictId = request.DistrictId;
            d.BranchId = request.BranchId;
            if (index == 0)
                d.AdditionalSharesWillingToBuy = request.AdditionalSharesWillingToBuy;

            index++;

            if (!d.TaxApplied)
                d.Tax = decision.Tax;

            d.AddDomainEvent(new DividendDecisionUpdated(d));
            await shareholderChangeLogService.LogDividendDecisionChange(d.Dividend.ShareholderId, d.Id, ChangeType.Modified, cancellationToken);
        }

        await dataService.SaveAsync(cancellationToken);

    }
}
