using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanApproveAllocation)]
public record ApproveAllocationCommand(int Id, string Comment) : IRequest;

public class ApproveAllocationCommandHandler : IRequestHandler<ApproveAllocationCommand>
{
    private readonly IDataService dataService;
    private readonly IAllocationService allocationService;
    private readonly IBackgroundJobScheduler backgroundJobService;

    public ApproveAllocationCommandHandler(IDataService dataService, IAllocationService allocationService, IBackgroundJobScheduler backgroundJobService)
    {
        this.dataService = dataService;
        this.allocationService = allocationService;
        this.backgroundJobService = backgroundJobService;
    }
    public async Task Handle(ApproveAllocationCommand request, CancellationToken cancellationToken)
    {
        var allocation = await dataService.Allocations.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (allocation != null)
        {
            allocation.ApprovalStatus = ApprovalStatus.Approved;
            allocation.WorkflowComment = request.Comment;

            await dataService.SaveAsync(cancellationToken);
            await allocationService.ComputeAllocationSummaryAsync(allocation.Id, cancellationToken);

            if (allocation.IsOnlyForExistingShareholders ?? false)
                backgroundJobService.EnqueueComputeShareholderAllocations(allocation.Id);
        }
    }
}
