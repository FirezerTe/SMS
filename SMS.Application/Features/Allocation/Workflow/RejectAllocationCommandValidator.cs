using FluentValidation;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Allocations.Workflow
{
    public class RejectAllocationCommandValidator : AbstractValidator<RejectAllocationCommand>
    {
        private readonly IDataService dataService;

        public RejectAllocationCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Comment).NotEmpty().WithMessage("Comment is required for approval.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find allocation.");
            RuleFor(p => p)
                .Must(ShouldHaveDraftForApprovalStatus)
                .WithMessage(x => $"Cannot reject a unsubmitted allocation");
        }

        private bool Exist(RejectAllocationCommand command)
        {
            return dataService.Allocations.Any(s => s.Id == command.Id);
        }

        private bool ShouldHaveDraftForApprovalStatus(RejectAllocationCommand command)
        {
            return dataService.Allocations.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
        }
    }
}
