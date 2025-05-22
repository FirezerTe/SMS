using FluentValidation;

using SMS.Domain.Enums;

namespace SMS.Application
{

    public class RejectShareholderApprovalRequestCommandValidator : AbstractValidator<RejectShareholderApprovalRequestCommand>
    {
        private readonly IDataService dataService;

        public RejectShareholderApprovalRequestCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Note).NotEmpty().WithMessage("Rejection comment is required.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find shareholder.");
            RuleFor(p => p)
                .Must(ShouldHaveSubmittedForApprovalStatus)
                .WithMessage(x => $"Cannot Reject a shareholder that is not submitted for approval.");
        }

        private bool Exist(RejectShareholderApprovalRequestCommand command)
        {
            return dataService.Shareholders.Any(s => s.Id == command.Id);
        }

        private bool ShouldHaveSubmittedForApprovalStatus(RejectShareholderApprovalRequestCommand command)
        {
            return dataService.Shareholders.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
        }
    }
}
