using FluentValidation;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public class SubmitBankAllocationApprovalRequestCommandValidator : AbstractValidator<SubmitBankAllocationApprovalRequestCommand>
    {
        private readonly IDataService dataService;

        public SubmitBankAllocationApprovalRequestCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Comment).NotEmpty().WithMessage("Comment is required for submission.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find bank allocation.");
            RuleFor(p => p)
                .Must(ShouldHaveDraftForApprovalStatus)
                .WithMessage(x => $"Cannot submit a non-draft record");
        }

        private bool Exist(SubmitBankAllocationApprovalRequestCommand command) => dataService.Banks.Any(s => s.Id == command.Id);

        private bool ShouldHaveDraftForApprovalStatus(SubmitBankAllocationApprovalRequestCommand command) => dataService.Banks.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Draft);
    }
}
