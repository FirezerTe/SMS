using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanApproveDividendSetup)]
public record TaxPendingDecisionsCommand(int SetupId) : IRequest;

public class TaxPendingDecisionsCommandHandler : IRequestHandler<TaxPendingDecisionsCommand>
{
    private readonly IDataService dataService;
    private readonly IBackgroundJobScheduler backgroundJobService;
    public TaxPendingDecisionsCommandHandler(IDataService dataService, IBackgroundJobScheduler backgroundJobService)
    {
        this.dataService = dataService;
        this.backgroundJobService = backgroundJobService;
    }
    public async Task Handle(TaxPendingDecisionsCommand request, CancellationToken cancellationToken)
    {
        var setup = await dataService.DividendSetups.FirstOrDefaultAsync(x => x.Id == request.SetupId);
        if (setup == null)
            throw new Exception($"Unable to find dividend setup (id: {request.SetupId})");

        await dataService.DividendDecisions.Where(d => d.Dividend.DividendSetupId == request.SetupId && d.Decision == DividendDecisionType.Pending)
                                            .Select(d => new { DividendDecision = d, ComputedTax = d.Dividend.DividendAmount * setup.TaxRate / 100 })
                                            .ExecuteUpdateAsync(setters => setters.SetProperty(d => d.DividendDecision.TaxApplied, true)
                                                                            .SetProperty(d => d.DividendDecision.Tax, d => d.ComputedTax));
        backgroundJobService.EnqueueTaxDueDateCompute(request.SetupId);
    }
}
