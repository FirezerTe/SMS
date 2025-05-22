using FluentValidation;
using Microsoft.EntityFrameworkCore;


namespace SMS.Application;


public class UpdateShareholderCommandValidator : AbstractValidator<UpdateShareholderCommand>
{
    private readonly IDataService dataService;

    public UpdateShareholderCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(p => p).MustAsync(Exist).WithMessage($"Unable to find shareholder");

        RuleFor(p => p.Name).NotEmpty().WithMessage(x => x.ShareholderType == Domain.Enums.ShareholderTypeEnum.Individual ? "First Name is required." : "Name is required");
        RuleFor(p => p).Must(HaveMiddleName).WithMessage("Middle Name is required.");
        RuleFor(p => p).Must(HaveLastName).WithMessage("Last Name is required.");
        RuleFor(p => p).NotEmpty().WithMessage("Amharic Name is required.");
        RuleFor(p => p).Must(HaveAmharicMiddleName).WithMessage("Amharic Middle Name is required.");
        RuleFor(p => p).Must(HaveAmharicLastName).WithMessage("Amharic Last Name is required.");
        RuleFor(p => p).MustAsync(HaveUniqueFullName).WithMessage("A shareholder with the same name already exists");

    }

    private async Task<bool> Exist(UpdateShareholderCommand command, CancellationToken token) => await dataService.Shareholders.AnyAsync(s => s.Id == command.Id);

    private async Task<bool> HaveUniqueFullName(UpdateShareholderCommand command, CancellationToken token)
    {
        if (command.ShareholderType == Domain.Enums.ShareholderTypeEnum.Individual)
        {
            if (string.IsNullOrWhiteSpace(command.MiddleName) || string.IsNullOrWhiteSpace(command.LastName)) return false;

            return !await dataService.Shareholders.AnyAsync(x => (
                x.Id != command.Id
                && x.Name.ToLower() == command.Name.ToLower()
                && x.MiddleName != null
                && x.LastName != null
                && x.MiddleName.ToLower() == command.MiddleName.ToLower()
                && x.LastName.ToLower() == command.LastName.ToLower()));
        }

        return !await dataService.Shareholders.AnyAsync(x => x.Id != command.Id && x.Name.ToLower() == command.Name.ToLower());
    }


    private bool HaveMiddleName(UpdateShareholderCommand command)
    {
        if (command.ShareholderType != Domain.Enums.ShareholderTypeEnum.Individual) return true;

        return !string.IsNullOrWhiteSpace(command.MiddleName);
    }

    private bool HaveLastName(UpdateShareholderCommand command)
    {
        if (command.ShareholderType != Domain.Enums.ShareholderTypeEnum.Individual) return true;

        return !string.IsNullOrWhiteSpace(command.LastName);
    }

    private bool HaveAmharicMiddleName(UpdateShareholderCommand command)
    {
        if (command.ShareholderType != Domain.Enums.ShareholderTypeEnum.Individual) return true;

        return !string.IsNullOrWhiteSpace(command.AmharicMiddleName);
    }

    private bool HaveAmharicLastName(UpdateShareholderCommand command)
    {
        if (command.ShareholderType != Domain.Enums.ShareholderTypeEnum.Individual) return true;

        return !string.IsNullOrWhiteSpace(command.AmharicLastName);
    }

}
