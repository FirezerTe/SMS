using FluentValidation;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public class ApproveBankAllocationCommandValidator : AbstractValidator<ApproveBankAllocationCommand>
    {
        private readonly IDataService dataService;

        public ApproveBankAllocationCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Comment).NotEmpty().WithMessage("Comment is required for approval.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to bank allocation");
            RuleFor(p => p)
                .Must(ShouldHaveSubmittedForApprovalStatus)
                .WithMessage(x => $"Record is not submitted for approval");
        }

        private bool Exist(ApproveBankAllocationCommand command)
        {
            return dataService.Banks.Any(s => s.Id == command.Id);
        }

        private bool ShouldHaveSubmittedForApprovalStatus(ApproveBankAllocationCommand command)
        {
            return dataService.Banks.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
        }
    }
}
