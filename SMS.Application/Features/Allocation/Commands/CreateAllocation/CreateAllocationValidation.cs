using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public class CreateAllocationValidation : AbstractValidator<CreateAllocationCommand>
{
    private readonly IDataService dataService;

    public CreateAllocationValidation(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(p => p.payload.Name).NotEmpty().WithMessage("Name is required.").NotNull();

        RuleFor(p => p.payload.Amount).NotEmpty().WithMessage("Amount is required.").NotNull();

        RuleFor(p => p.payload.FromDate).NotEmpty().WithMessage("From Date is required.").NotNull();

        RuleFor(p => p).Must(IsValidDateRange).WithMessage("Invalid Date Range");

        RuleFor(p => p).Must(IsAllocationNameUnique)
          .WithMessage("Allocation with the same Allocation Name already exists");

        RuleFor(p => p).MustAsync(HaveEnoughBankAllocation).WithMessage(x => $"Cannot allocate more than the total amount allocated by the bank");
    }

    private async Task<bool> HaveEnoughBankAllocation(CreateAllocationCommand command, CancellationToken token)
    {
        var submittedAllocations = await dataService.Allocations.Where(a => a.ApprovalStatus == ApprovalStatus.Submitted).ToListAsync();
        var submittedAllocationsAmount = submittedAllocations.Sum(x => x.Amount);
        var submittedAllocationIds = submittedAllocations.Select(a => a.Id).ToList();

        var approvedAllocations = await dataService.Allocations.TemporalAll()
                                                                          .Where(a => a.ApprovalStatus == ApprovalStatus.Approved && !submittedAllocationIds.Contains(a.Id))
                                                                          .OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd"))
                                                                          .GroupBy(p => new { p.Id })
                                                                          .Select(grp => grp.FirstOrDefault())
                                                                          .ToListAsync();

        var approvedAllocationsAmount = approvedAllocations.Sum(x => x?.Amount ?? 0);

        var bankAllocation = await dataService.Banks.TemporalAll()
                                                    .Where(a => a.ApprovalStatus == ApprovalStatus.Approved)
                                                    .OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd"))
                                                    .FirstOrDefaultAsync();

        return bankAllocation != null
            && (bankAllocation.Amount >= (approvedAllocationsAmount + submittedAllocationsAmount + command.payload.Amount));

    }

    private bool IsAllocationNameUnique(CreateAllocationCommand command) => !dataService.Allocations.Any(x => x.Name == command.payload.Name);
    private bool IsValidDateRange(CreateAllocationCommand command) => command.payload.FromDate != null && (command.payload.ToDate == null || command.payload.ToDate >= command.payload.FromDate);
}
