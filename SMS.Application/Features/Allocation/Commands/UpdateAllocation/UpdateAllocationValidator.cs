using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Allocation.Commands.UpdateAllocation;

public class UpdateAllocationValidator : AbstractValidator<UpdateAllocationCommand>
{
    private readonly IDataService dataService;

    public UpdateAllocationValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(p => p).Must(Exist).WithMessage(x => $"Unable to find allocation.");

        RuleFor(p => p.Name).NotEmpty().WithMessage("Name is required.").NotNull();

        RuleFor(p => p.Amount).NotEmpty().WithMessage("Amount is required.").NotNull();

        RuleFor(p => p.FromDate).NotEmpty().WithMessage("From Date is required.").NotNull();

        RuleFor(p => p).Must(IsValidDateRange).WithMessage("Invalid Date Range");

        RuleFor(p => p).Must(IsAllocationNameUnique)
          .WithMessage("Allocation with the same Allocation Name already exists");

        RuleFor(p => p).MustAsync(HaveEnoughBankAllocation).WithMessage(x => $"Cannot allocate more than the total amount allocated by the bank");
    }

    private async Task<bool> HaveEnoughBankAllocation(UpdateAllocationCommand command, CancellationToken token)
    {
        var submittedAllocations = await dataService.Allocations.Where(a => a.Id != command.Id && a.ApprovalStatus == ApprovalStatus.Submitted).ToListAsync();
        var submittedAllocationsAmount = submittedAllocations.Sum(x => x.Amount);

        var submittedAllocationIds = submittedAllocations.Select(a => a.Id).ToList();

        var approvedAllocations = await dataService.Allocations.TemporalAll()
                                                                          .Where(a => a.Id != command.Id && a.ApprovalStatus == ApprovalStatus.Approved && !submittedAllocationIds.Contains(a.Id))
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
            && (bankAllocation.Amount >= (approvedAllocationsAmount + submittedAllocationsAmount + command.Amount));

    }

    private bool Exist(UpdateAllocationCommand command) => dataService.Allocations.Any(s => s.Id == command.Id);
    private bool IsAllocationNameUnique(UpdateAllocationCommand command) => !string.IsNullOrWhiteSpace(command.Name) && !dataService.Allocations.Any(x => x.Name == command.Name.ToLower() && x.Id != command.Id);
    private bool IsValidDateRange(UpdateAllocationCommand command) => command.FromDate != null && (command.ToDate == null || command.ToDate >= command.FromDate);
}
