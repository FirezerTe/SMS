using FluentValidation;

namespace SMS.Application;

public class UpdateSubscriptionGroupCommandValidator : AbstractValidator<UpdateSubscriptionGroupCommand>
{
    private readonly IDataService dataService;

    public UpdateSubscriptionGroupCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;

        RuleFor(p => p.subscriptionGroup).Must(Exist).WithMessage("Unable to find Subscription Group");
        RuleFor(p => p.subscriptionGroup.Name).NotEmpty().WithMessage("Name is required.").NotNull();
        RuleFor(p => p.subscriptionGroup).Must(BeUnique).WithMessage("Subscription Group with the same Allocation Name already exists");
        RuleFor(p => p.subscriptionGroup).Must(HaveMinSubscriptionAmount).WithMessage("Minimum Subscription Amount is required");
        RuleFor(p => p.subscriptionGroup).Must(HaveEndDateLessThanAllocationEndDate).WithMessage("End Date cannot be later than selected allocation To Date");
        RuleFor(p => p.subscriptionGroup.MinimumSubscriptionAmount).Must(NotBeNegativeNumber).WithMessage("Minimum Subscription Amount cannot be negative number");
        RuleFor(p => p.subscriptionGroup.MinFirstPaymentAmount).Must(NotBeNegativeNumber).WithMessage("Minimum First Payment Amount cannot be negative number");
    }

    private bool Exist(SubscriptionGroupInfo subscriptionGroup) => dataService.SubscriptionGroups.Any(s => s.Id == subscriptionGroup.Id);

    private bool BeUnique(SubscriptionGroupInfo command) => !dataService.SubscriptionGroups.Any(x => !string.IsNullOrWhiteSpace(command.Name) && x.Id != command.Id && x.Name.ToLower() == command.Name.ToLower());

    private bool HaveMinSubscriptionAmount(SubscriptionGroupInfo command) => command.MinimumSubscriptionAmount > 0;

    private bool HaveEndDateLessThanAllocationEndDate(SubscriptionGroupInfo command)
    {
        if (command.ExpireDate == null) return true;

        var allocation = dataService.Allocations.FirstOrDefault(a => a.Id == command.AllocationID);
        return allocation != null && (allocation.ToDate == null || allocation.ToDate >= command.ExpireDate);
    }

    private bool NotBeNegativeNumber(decimal? amount) => amount == null || amount >= 0;

}
