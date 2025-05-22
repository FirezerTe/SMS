using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record BlockShareholderCommand(double? Amount, ShareUnit? Unit, string Description, DateTime? BlockedTill, bool? IsActive, int ShareholderId, int BlockTypeId, int BlockReasonId, DateOnly EffectiveDate) : IRequest;

internal class BlockShareholderCommandHandler : IRequestHandler<BlockShareholderCommand>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public BlockShareholderCommandHandler(IDataService dataService, IMediator mediator, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.mediator = mediator;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public async Task Handle(BlockShareholderCommand request, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == request.ShareholderId);
        if (shareholder == null)
        {
            throw new NotFoundException($"Unable to find shareholder", request);
        }

        var blockage = await dataService.BlockedShareholders.FirstOrDefaultAsync(s => s.ShareholderId == request.ShareholderId);
        if (blockage == null)
        {
            blockage = new BlockedShareholder();
            dataService.BlockedShareholders.Add(blockage);
        }

        blockage.Amount = request.Amount;
        blockage.Unit = request.Unit;
        blockage.Description = request.Description;
        blockage.BlockedTill = request.BlockedTill;
        blockage.EffectiveDate = request.EffectiveDate;
        blockage.IsActive = request.IsActive;
        blockage.ShareholderId = request.ShareholderId;
        blockage.BlockTypeId = request.BlockTypeId;
        blockage.BlockReasonId = request.BlockReasonId;
        blockage.IsActive = true;

        if (blockage.Attachments != null)
            blockage.Attachments.Clear();

        shareholder.IsBlocked = true;
        shareholder.ShareholderStatus = ShareholderStatusEnum.Blocked;

        await dataService.SaveAsync(cancellationToken);
        await mediator.Send(new AddShareholderCommentCommand(request.ShareholderId, CommentType.Block, request.Description));
        await shareholderChangeLogService.LogShareholderBlockageChange(shareholder, ChangeType.Blocked, cancellationToken);
    }
}
