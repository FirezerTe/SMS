using FluentValidation;

using SMS.Domain.Enums;

namespace SMS.Application;

public class ApproveShareholderCommandValidator : AbstractValidator<ApproveShareholderCommand>
{
    private readonly IDataService dataService;

    public ApproveShareholderCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(p => p.Note).NotEmpty().WithMessage("Approval comment is required.");
        RuleFor(p => p)
            .Must(Exist)
            .WithMessage(x => $"Unable to find shareholder.");
        RuleFor(p => p)
            .Must(ShouldHaveSubmittedForApprovalStatus)
            .WithMessage(x => $"Cannot Approve a shareholder that is not submitted for approval.");
    }

    private bool Exist(ApproveShareholderCommand command)
    {
        return dataService.Shareholders.Any(s => s.Id == command.Id);
    }

    private bool ShouldHaveSubmittedForApprovalStatus(ApproveShareholderCommand command)
    {
        return dataService.Shareholders.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
    }
}
