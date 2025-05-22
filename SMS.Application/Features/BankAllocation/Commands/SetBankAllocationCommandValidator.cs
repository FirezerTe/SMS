using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public class SetBankAllocationCommandValidator : AbstractValidator<SetBankAllocationCommand>
{
    private readonly IDataService dataService;

    public SetBankAllocationCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(a => a.Name).NotEmpty().WithMessage("Name is required");
        RuleFor(a => a.Amount).Must(BePositive).WithMessage("Amount should be positive");
        RuleFor(a => a).MustAsync(HaveMaxOfOneRecord).WithMessage("Cannot have more than one bank level allocation");
    }

    private bool BePositive(decimal amount) => amount > 0;

    private async Task<bool> HaveMaxOfOneRecord(SetBankAllocationCommand command, CancellationToken token) => await dataService.Banks.CountAsync() < 2;
}
