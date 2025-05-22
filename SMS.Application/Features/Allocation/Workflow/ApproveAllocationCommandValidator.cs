using FluentValidation;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public class ApproveAllocationCommandValidator : AbstractValidator<ApproveAllocationCommand>
    {
        private readonly IDataService dataService;

        public ApproveAllocationCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Comment).NotEmpty().WithMessage("Comment is required for approval.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find allocation.");
            RuleFor(p => p)
                .Must(ShouldHaveDraftForApprovalStatus)
                .WithMessage(x => $"Cannot approve a unsubmitted allocation.");

            RuleFor(p => p)
                .Must(ShouldNotBeLessThanSoldSubscriptions)
                .WithMessage(x => $"Allocation amount should be greater than already sold subscriptions.");
        }

        private bool Exist(ApproveAllocationCommand command)
        {
            return dataService.Allocations.Any(s => s.Id == command.Id);
        }

        private bool ShouldHaveDraftForApprovalStatus(ApproveAllocationCommand command)
        {
            return dataService.Allocations.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
        }

        private bool ShouldNotBeLessThanSoldSubscriptions(ApproveAllocationCommand command)
        {
            var subscriptionSummary = dataService.AllocationSubscriptionSummaries.FirstOrDefault(summary => summary.AllocationId == command.Id);
            if (subscriptionSummary == null) return true;

            var allocation = dataService.Allocations.FirstOrDefault(s => s.Id == command.Id);
            if (allocation == null) return true;

            return allocation.Amount >= subscriptionSummary.TotalApprovedSubscriptions + subscriptionSummary.TotalPendingApprovalSubscriptions;
        }
    }
}
