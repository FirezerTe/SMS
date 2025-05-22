using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanApproveParValue)]
public record ApproveParValueCommand(int Id, string Comment) : IRequest;


internal class ApproveParValueCommandHandler : IRequestHandler<ApproveParValueCommand>
{
    private readonly IDataService dataService;
    private readonly IBackgroundJobScheduler backgroundJobScheduler;

    public ApproveParValueCommandHandler(IDataService dataService, IBackgroundJobScheduler backgroundJobScheduler)
    {
        this.dataService = dataService;
        this.backgroundJobScheduler = backgroundJobScheduler;
    }
    public async Task Handle(ApproveParValueCommand request, CancellationToken cancellationToken)
    {
        var parValue = await dataService.ParValues.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (parValue != null)
        {
            parValue.ApprovalStatus = ApprovalStatus.Approved;
            parValue.WorkflowComment = request.Comment;
            await dataService.SaveAsync(cancellationToken);
            backgroundJobScheduler.EnqueueCreateOrUpdateShares();
        }
    }
}
