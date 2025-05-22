using FluentValidation;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public class SubmitAllocationApprovalRequestCommandValidator : AbstractValidator<SubmitAllocationApprovalRequestCommand>
    {
        private readonly IDataService dataService;

        public SubmitAllocationApprovalRequestCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Comment).NotEmpty().WithMessage("Comment is required for submission.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find Allocation.");
            RuleFor(p => p)
                .Must(ShouldHaveDraftForApprovalStatus)
                .WithMessage(x => $"Cannot submit a non-draft record");

            RuleFor(p => p)
              .Must(ShouldNotBeLessThanSoldSubscriptions)
              .WithMessage(x => $"Allocation amount should be greater than already sold subscriptions.");
        }

        private bool Exist(SubmitAllocationApprovalRequestCommand command)
        {
            var allocation = dataService.Allocations.FirstOrDefault(s => s.Id == command.Id);
            return allocation != null;
        }

        private bool ShouldHaveDraftForApprovalStatus(SubmitAllocationApprovalRequestCommand command)
        {
            return dataService.Allocations.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Draft);
        }

        private bool ShouldNotBeLessThanSoldSubscriptions(SubmitAllocationApprovalRequestCommand command)
        {
            var subscriptionSummary = dataService.AllocationSubscriptionSummaries.FirstOrDefault(summary => summary.AllocationId == command.Id);
            if (subscriptionSummary == null) return true;

            var allocation = dataService.Allocations.FirstOrDefault(s => s.Id == command.Id);
            if (allocation == null) return true;

            return allocation.Amount >= subscriptionSummary.TotalApprovedSubscriptions + subscriptionSummary.TotalPendingApprovalSubscriptions;
        }
    }
}
