using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanApproveBankAllocation)]
public record RejectBankAllocationCommand(int Id, string Comment) : IRequest;

internal class RejectBankAllocationCommandHandler : IRequestHandler<RejectBankAllocationCommand>
{
    private readonly IDataService dataService;

    public RejectBankAllocationCommandHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(RejectBankAllocationCommand request, CancellationToken cancellationToken)
    {
        var bankAllocation = await dataService.Banks.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (bankAllocation != null)
        {
            bankAllocation.ApprovalStatus = ApprovalStatus.Rejected;
            bankAllocation.WorkflowComment = request.Comment;
            await dataService.SaveAsync(cancellationToken);
        }
    }
}
