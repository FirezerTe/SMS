using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;


[Authorize(Policy = AuthPolicy.CanApproveShareholder)]
public record RejectShareholderApprovalRequestCommand(int Id, string Note) : IRequest;

public class RejectShareholderApprovalRequestCommandHandler : IRequestHandler<RejectShareholderApprovalRequestCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;
    private readonly IMediator mediator;

    public RejectShareholderApprovalRequestCommandHandler(IDataService dataService, IUserService userService, IMediator mediator)
    {
        this.dataService = dataService;
        this.userService = userService;
        this.mediator = mediator;
    }
    public async Task Handle(RejectShareholderApprovalRequestCommand request, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (shareholder != null)
        {
            shareholder.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            await mediator.Send(new AddShareholderCommentCommand(request.Id, CommentType.Rejection, request.Note));
        }
    }
}
