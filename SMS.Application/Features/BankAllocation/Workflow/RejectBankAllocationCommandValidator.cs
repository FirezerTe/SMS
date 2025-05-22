using FluentValidation;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public class RejectBankAllocationCommandValidator : AbstractValidator<RejectBankAllocationCommand>
    {
        private readonly IDataService dataService;

        public RejectBankAllocationCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Comment).NotEmpty().WithMessage("Comment is required.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find bank allocation.");
            RuleFor(p => p)
                .Must(ShouldHaveSubmittedForApprovalStatus)
                .WithMessage(x => $"Record is not submitted for approval");
        }

        private bool Exist(RejectBankAllocationCommand command) => dataService.Banks.Any(s => s.Id == command.Id);

        private bool ShouldHaveSubmittedForApprovalStatus(RejectBankAllocationCommand command) => dataService.Banks.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
    }
}
