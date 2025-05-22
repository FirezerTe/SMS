using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;


public class AddDividendSetupCommandValidator : AbstractValidator<AddDividendSetupCommand>
{
    private readonly IDataService dataService;

    public AddDividendSetupCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;

        RuleFor(setup => setup).MustAsync(NotHaveAnotherSetupForTheGivenDividendPeriod)
                                       .WithMessage("Dividend Setup is already defined for the dividend period");

        RuleFor(a => a.DeclaredAmount).Must(BePositive).WithMessage("Declared Amount should be positive");
        RuleFor(a => a.TaxRate).Must(BePositive).WithMessage("Tax Rate should be positive");

    }

    private async Task<bool> NotHaveAnotherSetupForTheGivenDividendPeriod(AddDividendSetupCommand command, CancellationToken token)
    {
        var exists = await dataService.DividendSetups.AnyAsync(setup => setup.DividendPeriodId == command.DividendPeriodId);
        return !exists;
    }

    private bool BePositive(decimal amount) => amount > 0;

}
