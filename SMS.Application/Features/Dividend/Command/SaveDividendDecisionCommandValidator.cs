using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public class SaveDividendDecisionCommandValidator : AbstractValidator<SaveDividendDecisionCommand>
{
    private readonly IDataService dataService;

    public SaveDividendDecisionCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(d => d).MustAsync(AllDividendsExistAndAreUnapproved).WithMessage("Bad request");
        RuleFor(p => p.DecisionDate).NotEmpty().WithMessage("Decision Date is required.");
        RuleFor(p => p.DecisionDate).Must(ValidSubscriptionDate).WithMessage(x => "Decision date cannot be future date.");
        RuleFor(p => p.DistrictId).NotEmpty().WithMessage("District is required.");
        RuleFor(p => p.BranchId).NotEmpty().WithMessage("Branch is required.");
    }


    private bool ValidSubscriptionDate(DateOnly decisionDate) => decisionDate <= DateOnly.FromDateTime(DateTime.Now);

    private async Task<bool> AllDividendsExistAndAreUnapproved(SaveDividendDecisionCommand command, CancellationToken token)
    {
        if (!command.decisionIds.Any()) return false;
        var dividendDecisions = await dataService.DividendDecisions
                        .Where(d => command.decisionIds.Contains(d.Id) && d.ApprovalStatus != ApprovalStatus.Approved)
                        .ToListAsync();

        return dividendDecisions.All(d => command.decisionIds.Contains(d.Id));
    }
}
