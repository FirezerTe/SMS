using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public class ComputeDividendRateCommandValidator : AbstractValidator<ComputeDividendRateCommand>
{
    private readonly IDataService dataService;

    public ComputeDividendRateCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;

        RuleFor(c => c).MustAsync(Exist).WithMessage("Unable to find dividend setup");
        RuleFor(c => c).MustAsync(NotBeCompleted).WithMessage("Dividend Rate is already computed");
        RuleFor(c => c).MustAsync(NotBeComputing).WithMessage("Dividend Rate computation is already in progress");
    }

    private async Task<bool> NotBeComputing(ComputeDividendRateCommand command, CancellationToken token)
    {
        var setup = await dataService.DividendSetups.FirstOrDefaultAsync(s => s.Id == command.SetupID);

        return setup == null || setup.DividendRateComputationStatus != Domain.DividendRateComputationStatus.Computing;
    }

    private async Task<bool> NotBeCompleted(ComputeDividendRateCommand command, CancellationToken token)
    {
        var setup = await dataService.DividendSetups.FirstOrDefaultAsync(s => s.Id == command.SetupID);

        return setup == null || setup.DividendRateComputationStatus != Domain.DividendRateComputationStatus.Completed;
    }

    private async Task<bool> Exist(ComputeDividendRateCommand command, CancellationToken token) => await dataService.DividendSetups.AnyAsync(s => s.Id == command.SetupID);
}
