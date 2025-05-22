using FluentValidation;

namespace SMS.Application;

public class SaveShareholderRepresentativeCommandValidator : AbstractValidator<SaveShareholderRepresentativeCommand>
{
    private readonly IDataService dataService;

    public SaveShareholderRepresentativeCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(p => p)
            .Must(Exist)
            .WithMessage(x => $"Unable to find shareholder.");
    }

    private bool Exist(SaveShareholderRepresentativeCommand command)
    {
        return dataService.Shareholders.Any(s => s.Id == command.ShareholderId);
    }
}
