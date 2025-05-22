using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record ComputeDividendDecisionCommand(List<int> decisionIds, decimal amountToCapitalize) : IRequest<DividendComputationResults>;

public class ComputeDividendDecisionCommandHandler : IRequestHandler<ComputeDividendDecisionCommand, DividendComputationResults>
{
    private readonly IDividendService dividendService;
    private readonly IDataService dataService;

    public ComputeDividendDecisionCommandHandler(IDividendService dividendService, IDataService dataService)
    {
        this.dividendService = dividendService;
        this.dataService = dataService;
    }
    public async Task<DividendComputationResults> Handle(ComputeDividendDecisionCommand request, CancellationToken cancellationToken)
    {
        var ids = await dataService.DividendDecisions.Where(d => request.decisionIds.Contains(d.Id) && d.ApprovalStatus != Domain.Enums.ApprovalStatus.Approved).Select(d => d.Id).ToListAsync();

        return await dividendService.ComputeDividendDecision(ids, request.amountToCapitalize);
    }
}
