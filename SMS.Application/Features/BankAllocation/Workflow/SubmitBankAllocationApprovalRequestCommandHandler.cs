using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateBankAllocation)]
public record SubmitBankAllocationApprovalRequestCommand(int Id, string Comment) : IRequest;

internal class SubmitBankAllocationApprovalRequestCommandHandler : IRequestHandler<SubmitBankAllocationApprovalRequestCommand>
{
    private readonly IDataService dataService;

    public SubmitBankAllocationApprovalRequestCommandHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(SubmitBankAllocationApprovalRequestCommand request, CancellationToken cancellationToken)
    {
        var bankAllocation = await dataService.Banks.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (bankAllocation != null)
        {
            bankAllocation.ApprovalStatus = ApprovalStatus.Submitted;
            bankAllocation.WorkflowComment = request.Comment;
            await dataService.SaveAsync(cancellationToken);
        }
    }
}
