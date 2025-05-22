using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateParValue)]
public record SubmitParValueApprovalRequestCommand(int Id, string Comment) : IRequest;

internal class SubmitParValueApprovalRequestCommandHandler : IRequestHandler<SubmitParValueApprovalRequestCommand>
{
    private readonly IDataService dataService;

    public SubmitParValueApprovalRequestCommandHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(SubmitParValueApprovalRequestCommand request, CancellationToken cancellationToken)
    {
        var parValue = await dataService.ParValues.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (parValue != null)
        {
            parValue.ApprovalStatus = ApprovalStatus.Submitted;
            parValue.WorkflowComment = request.Comment;
            await dataService.SaveAsync(cancellationToken);
        }
    }
}
