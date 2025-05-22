using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record UnBlockShareholderCommand(int ShareholderId, string Description) : IRequest;

internal class UnBlockShareholderCommandHandler : IRequestHandler<UnBlockShareholderCommand>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public UnBlockShareholderCommandHandler(IDataService dataService, IMediator mediator, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.mediator = mediator;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public async Task Handle(UnBlockShareholderCommand request, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == request.ShareholderId);
        if (shareholder == null)
        {
            throw new NotFoundException($"Unable to find sharholder", request);
        }


        var blockage = await dataService.BlockedShareholders.FirstOrDefaultAsync(s => s.ShareholderId == request.ShareholderId);
        if (blockage == null)
        {
            throw new NotFoundException($"Unable to find blockage", request);
        }

        shareholder.ShareholderStatus = ShareholderStatusEnum.Active;
        shareholder.IsBlocked = false;
        blockage.IsActive = false;

        await dataService.SaveAsync(cancellationToken);
        await mediator.Send(new AddShareholderCommentCommand(request.ShareholderId, CommentType.Unblock, request.Description));
        await shareholderChangeLogService.LogShareholderBlockageChange(shareholder, ChangeType.Unblocked, cancellationToken);
    }
}
