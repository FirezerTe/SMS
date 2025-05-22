using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateAllocation)]
public record SubmitAllocationApprovalRequestCommand(int Id, string Comment) : IRequest;

internal class SubmitAllocationApprovalRequestCommandHandler : IRequestHandler<SubmitAllocationApprovalRequestCommand>
{
    private readonly IDataService dataService;
    private readonly IAllocationService allocationService;

    public SubmitAllocationApprovalRequestCommandHandler(IDataService dataService, IAllocationService allocationService)
    {
        this.dataService = dataService;
        this.allocationService = allocationService;
    }
    public async Task Handle(SubmitAllocationApprovalRequestCommand request, CancellationToken cancellationToken)
    {
        var allocation = await dataService.Allocations.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (allocation != null)
        {
            allocation.ApprovalStatus = ApprovalStatus.Submitted;
            allocation.WorkflowComment = request.Comment;

            await dataService.SaveAsync(cancellationToken);
            await allocationService.ComputeAllocationSummaryAsync(allocation.Id, cancellationToken);

        }
    }
}
