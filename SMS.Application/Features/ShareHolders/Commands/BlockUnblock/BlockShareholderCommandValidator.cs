using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public class BlockShareholderCommandValidator : AbstractValidator<BlockShareholderCommand>
{
    private readonly IDataService dataService;

    public BlockShareholderCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(p => p.Description).NotEmpty().WithMessage("Block shareholder description is required.");
        RuleFor(p => p).MustAsync(ExistAsync).WithMessage($"Unable to find shareholder.");
        RuleFor(p => p).MustAsync(NotBeInBlockedStatus).WithMessage($"Shareholder is already blocked");
    }

    private async Task<bool> NotBeInBlockedStatus(BlockShareholderCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == command.ShareholderId);
        return shareholder != null && !shareholder.IsBlocked;

    }

    private async Task<bool> ExistAsync(BlockShareholderCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == command.ShareholderId);
        return shareholder != null;
    }
}
