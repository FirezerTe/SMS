using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanApproveBankAllocation)]
public record ApproveBankAllocationCommand(int Id, string Comment) : IRequest;


internal class ApproveBankAllocationCommandHandler : IRequestHandler<ApproveBankAllocationCommand>
{
    private readonly IDataService dataService;
    private readonly IBackgroundJobScheduler backgroundJobService;

    public ApproveBankAllocationCommandHandler(IDataService dataService, IBackgroundJobScheduler backgroundJobService)
    {
        this.dataService = dataService;
        this.backgroundJobService = backgroundJobService;
    }
    public async Task Handle(ApproveBankAllocationCommand request, CancellationToken cancellationToken)
    {
        var bankAllocation = await dataService.Banks.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (bankAllocation != null)
        {
            bankAllocation.ApprovalStatus = ApprovalStatus.Approved;
            bankAllocation.WorkflowComment = request.Comment;
            await dataService.SaveAsync(cancellationToken);

            backgroundJobService.EnqueueCreateOrUpdateShares();
        }
    }
}
