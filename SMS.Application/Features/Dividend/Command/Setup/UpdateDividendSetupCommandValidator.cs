using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public class UpdateDividendSetupCommandValidator : AbstractValidator<UpdateDividendSetupCommand>
{
    private readonly IDataService dataService;

    public UpdateDividendSetupCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;


        RuleFor(setup => setup).MustAsync(Exist)
                                       .WithMessage("Unable to find dividend setup");

        RuleFor(a => a.DeclaredAmount).Must(BePositive).WithMessage("Declared Amount should be positive");
        RuleFor(a => a.TaxRate).Must(BePositive).WithMessage("Tax Rate should be positive");
    }

    private async Task<bool> Exist(UpdateDividendSetupCommand command, CancellationToken token)
    {
        return await dataService.DividendSetups.AnyAsync(x => x.Id == command.Id);
    }

    private bool BePositive(decimal amount) => amount > 0;


}
