using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanApproveAllocation)]
public record RejectAllocationCommand(int Id, string Comment) : IRequest;


internal class RejectAllocationCommandHandler : IRequestHandler<RejectAllocationCommand>
{
    private readonly IDataService dataService;
    private readonly IAllocationService allocationService;

    public RejectAllocationCommandHandler(IDataService dataService, IAllocationService allocationService)
    {
        this.dataService = dataService;
        this.allocationService = allocationService;
    }
    public async Task Handle(RejectAllocationCommand request, CancellationToken cancellationToken)
    {
        var allocation = await dataService.Allocations.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (allocation != null)
        {
            allocation.ApprovalStatus = ApprovalStatus.Rejected;
            allocation.WorkflowComment = request.Comment;
            await dataService.SaveAsync(cancellationToken);
            await allocationService.ComputeAllocationSummaryAsync(allocation.Id, cancellationToken);
        }
    }
}
