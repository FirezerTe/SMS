using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanApproveParValue)]
public record RejectParValueCommand(int Id, string Comment) : IRequest;


internal class RejectParValueCommandHandler : IRequestHandler<RejectParValueCommand>
{
    private readonly IDataService dataService;

    public RejectParValueCommandHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(RejectParValueCommand request, CancellationToken cancellationToken)
    {
        var parValue = await dataService.ParValues.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (parValue != null)
        {
            parValue.ApprovalStatus = ApprovalStatus.Rejected;
            parValue.WorkflowComment = request.Comment;
            await dataService.SaveAsync(cancellationToken);
        }
    }
}
