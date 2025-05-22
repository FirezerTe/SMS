using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public class AddSubscriptionCommandValidator : AbstractValidator<AddSubscriptionCommand>
{
    private readonly IDataService dataService;
    private readonly IParValueService parValueService;

    public AddSubscriptionCommandValidator(IDataService dataService, IParValueService parValueService)
    {
        this.dataService = dataService;
        this.parValueService = parValueService;

        RuleFor(p => p.Amount).NotEmpty().WithMessage("Amount is required.");
        RuleFor(p => p.SubscriptionDate).NotEmpty().WithMessage("Subscription date is required.");
        RuleFor(p => p.ShareholderId).NotEmpty().WithMessage("Shareholder is required.");
        RuleFor(p => p.SubscriptionGroupID).NotEmpty().WithMessage("Subscription Group is required.");
        RuleFor(p => p.SubscriptionDistrictID).NotEmpty().WithMessage("District is required.");
        RuleFor(p => p.SubscriptionBranchID).NotEmpty().WithMessage("Branch is required.");
        RuleFor(p => p.SubscriptionDate).Must(ValidSubscriptionDate).WithMessage("Subscription date cannot be a future date.");
        RuleFor(p => p).Must(ValidSubscriptionPaymentDueDate).WithMessage("Subscription Payment Due Date must be after Subscription Date");
        RuleFor(p => p.ShareholderId).Must(ValidShareholder).WithMessage(x => "Cannot add subscription to inactive shareholder.");
        RuleFor(p => p.SubscriptionGroupID).Must(IsActiveSubscriptionGroup).WithMessage(x => $"Inactive Subscription Group");
        RuleFor(p => p).Must(BeMultipleOfParValue).WithMessage(x => "Amount must be multiple of Par Value");
        RuleFor(p => p).Must(BeGreaterThanMinSubscriptionValue).WithMessage(x => "Amount must greater than or equal to the minimum allowed subscription");
        RuleFor(p => p).MustAsync(NotExceedAllocationAmount).WithMessage(x => $"Unsold allocation amount is less than {x.Amount}");
        RuleFor(p => p).MustAsync(HavePremiumPaymentReceiptNumber).WithMessage("Premium Payment Receipt # is required");
        RuleFor(p => p).MustAsync(NotExceedMaxPurchaseLimit).WithMessage("Exceeded max purchase limit");
        RuleFor(p => p).MustAsync(NotExceedMaxMaxAllocatedAmount).WithMessage("Exceeded the max allowed subscription amount");
    }

    private bool ValidSubscriptionPaymentDueDate(AddSubscriptionCommand command) => command.SubscriptionPaymentDueDate >= DateOnly.FromDateTime(command.SubscriptionDate);

    private async Task<bool> NotExceedMaxMaxAllocatedAmount(AddSubscriptionCommand command, CancellationToken token)
    {
        var allocationId = await dataService.SubscriptionGroups.Where(s => s.Id == command.SubscriptionGroupID).Select(s => s.AllocationID).FirstOrDefaultAsync();

        var allocation = await dataService.Allocations.TemporalAll()
                                                      .Where(x => x.Id == allocationId && x.ApprovalStatus == ApprovalStatus.Approved)
                                                      .OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd"))
                                                      .FirstOrDefaultAsync();

        if (allocation == null) return false;

        if (allocation.IsOnlyForExistingShareholders == true)
        {
            var shareholderAllocation = await dataService.ShareholderAllocations.FirstOrDefaultAsync(a => a.ShareholderId == command.ShareholderId && a.AllocationId == allocationId);
            if (shareholderAllocation == null) return false;

            var otherApprovedOrSubmittedTotalSubscriptions = await dataService.Subscriptions.Where(s => s.SubscriptionGroup.AllocationID == allocationId && s.ShareholderId == command.ShareholderId
                                                                                                       && (s.ApprovalStatus == ApprovalStatus.Submitted || s.ApprovalStatus == ApprovalStatus.Approved))
                                                                                 .Select(s => s.Amount)
                                                                                 .SumAsync();

            return shareholderAllocation.MaxPurchaseLimit >= otherApprovedOrSubmittedTotalSubscriptions + command.Amount;
        }

        return true;
    }

    private async Task<bool> NotExceedMaxPurchaseLimit(AddSubscriptionCommand command, CancellationToken token)
    {
        var latestBankAllocation = await dataService.Banks.TemporalAll()
                                                                .Where(x => x.ApprovalStatus == ApprovalStatus.Approved)
                                                                .OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd"))
                                                                .FirstOrDefaultAsync();

        if (latestBankAllocation == null) return false;

        if (latestBankAllocation.MaxPercentagePurchaseLimit == null) return true;

        var otherApprovedOrSubmittedSubscriptionsAmount = await dataService.Subscriptions.Where(s => s.ShareholderId == command.ShareholderId
                                                                                                      && (s.ApprovalStatus == ApprovalStatus.Submitted || s.ApprovalStatus == ApprovalStatus.Approved))
                                                                                .Select(s => s.Amount)
                                                                                .SumAsync();


        return (otherApprovedOrSubmittedSubscriptionsAmount + command.Amount) <= latestBankAllocation.Amount * latestBankAllocation.MaxPercentagePurchaseLimit / 100;
    }

    private async Task<bool> NotExceedAllocationAmount(AddSubscriptionCommand command, CancellationToken cancellationToken)
    {
        var allocationId = await dataService.SubscriptionGroups.Where(s => s.Id == command.SubscriptionGroupID).Select(x => x.AllocationID).FirstOrDefaultAsync();
        var approveAllocation = await dataService.Allocations.TemporalAll().Where(a => a.Id == allocationId && a.ApprovalStatus == ApprovalStatus.Approved).OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd")).FirstOrDefaultAsync();

        if (approveAllocation == null) return false;

        var otherApprovedOrSubmittedTotalSubscriptions = await dataService.Subscriptions.Where(s => s.SubscriptionGroup.AllocationID == allocationId
                                                                                                       && (s.ApprovalStatus == ApprovalStatus.Submitted || s.ApprovalStatus == ApprovalStatus.Approved))
                                                                                 .Select(s => s.Amount)
                                                                                 .SumAsync();

        return approveAllocation.Amount >= otherApprovedOrSubmittedTotalSubscriptions + command.Amount;
    }

    private bool BeGreaterThanMinSubscriptionValue(AddSubscriptionCommand command)
    {
        var subscriptionGroup = dataService.SubscriptionGroups.FirstOrDefault(s => s.Id == command.SubscriptionGroupID);
        if (subscriptionGroup == null) return false;

        return subscriptionGroup.MinimumSubscriptionAmount <= command.Amount;
    }

    private async Task<bool> HavePremiumPaymentReceiptNumber(AddSubscriptionCommand command, CancellationToken token)
    {
        var hasApprovedSubscription = await dataService.Subscriptions.AnyAsync(s => s.ShareholderId == command.ShareholderId && s.ApprovalStatus == ApprovalStatus.Approved);
        return hasApprovedSubscription || !string.IsNullOrWhiteSpace(command.PremiumPaymentReceiptNo);
    }

    private bool BeMultipleOfParValue(AddSubscriptionCommand command)
    {
        var currentParValue = parValueService.GetCurrentParValue().GetAwaiter().GetResult();

        return currentParValue != null && command.Amount % currentParValue.Amount == 0;
    }

    private bool ValidSubscriptionDate(DateTime subscriptionDate) => subscriptionDate <= DateTime.Now;

    private bool ValidShareholder(int shareholderID) =>
        dataService.Shareholders.Any(x => x.Id == shareholderID && x.ShareholderStatus != ShareholderStatusEnum.Inactive);

    private bool IsActiveSubscriptionGroup(int subscriptionGroupID)
    {
        var subscriptionGroup = dataService.SubscriptionGroups.FirstOrDefault(x => x.Id == subscriptionGroupID);
        return subscriptionGroup != null && subscriptionGroup.IsActive;
    }
}
