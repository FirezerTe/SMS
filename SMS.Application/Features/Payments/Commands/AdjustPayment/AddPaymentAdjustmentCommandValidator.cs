using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public class AddPaymentAdjustmentCommandValidator : AbstractValidator<AddPaymentAdjustmentCommand>
{
    private readonly IDataService dataService;
    private readonly IParValueService parValueService;

    public AddPaymentAdjustmentCommandValidator(IDataService dataService, IParValueService parValueService)
    {
        this.dataService = dataService;
        this.parValueService = parValueService;
        RuleFor(p => p.ParentPaymentId).MustAsync(Exist).WithMessage(x => "Unable to find payment");
        RuleFor(p => p).Must(BeApprovedPayment).WithMessage(x => "Cannot add adjustment to unapproved payment.");
        RuleFor(p => p).Must(BeMultipleOfParValue).WithMessage(x => "Adjustment Amount must be multiple of Par Value");
        RuleFor(p => p.PaymentType).NotEmpty().WithMessage("Payment type is required.");
        RuleFor(p => p.DistrictId).NotEmpty().WithMessage("District is required.");
        RuleFor(p => p.BranchId).NotEmpty().WithMessage("Branch is required.");
        RuleFor(p => p).Must(NotExceedTotalSubscribedAmount).WithMessage(x => "Total paid amount exceeds subscribed amount");
        RuleFor(p => p).MustAsync(NotBeAdjustedPayment).WithMessage("Cannot adjust approved Adjustment payment");
        RuleFor(p => p).MustAsync(NotBeAlreadyAdjustedPayment).WithMessage("Cannot adjust already adjusted payment");
    }

    private bool IsAdjustmentPaymentType(PaymentTypeEnum type) => type == PaymentTypeEnum.Reversal || type == PaymentTypeEnum.Correction;

    private async Task<bool> NotBeAlreadyAdjustedPayment(AddPaymentAdjustmentCommand command, CancellationToken token)
    {
        var payment = await dataService.Payments.FirstOrDefaultAsync(s => s.Id == command.ParentPaymentId);
        if (payment == null || payment.ApprovalStatus != ApprovalStatus.Approved) return true;

        var adjustments = await dataService.Payments.Where(p => p.ParentPaymentId == payment.Id && p.ApprovalStatus == ApprovalStatus.Approved)
                                                       .Select(p => p.PaymentTypeEnum).ToListAsync();

        if (adjustments.Any(IsAdjustmentPaymentType)) return false;

        return true;
    }

    private async Task<bool> NotBeAdjustedPayment(AddPaymentAdjustmentCommand command, CancellationToken token)
    {
        var payment = await dataService.Payments.FirstOrDefaultAsync(s => s.Id == command.ParentPaymentId);
        if (payment == null || payment.ApprovalStatus != ApprovalStatus.Approved) return true;

        var isAdjustmentPayment = payment.PaymentTypeEnum != PaymentTypeEnum.Reversal
               && payment.PaymentTypeEnum != PaymentTypeEnum.Correction;

        if (IsAdjustmentPaymentType(payment.PaymentTypeEnum)) return false;

        return true;
    }

    public async Task<bool> Exist(int id, CancellationToken token)
    {
        var payment = await dataService.Payments.FirstOrDefaultAsync(s => s.Id == id);
        return payment != null;
    }

    private bool BeApprovedPayment(AddPaymentAdjustmentCommand command)
    {
        var payment = dataService.Payments.FirstOrDefault(s => s.Id == command.ParentPaymentId);
        return payment != null && payment.ApprovalStatus == Domain.Enums.ApprovalStatus.Approved;
    }

    private bool BeMultipleOfParValue(AddPaymentAdjustmentCommand command)
    {
        var currentParValue = parValueService.GetCurrentParValue().GetAwaiter().GetResult();

        return currentParValue != null && command.Amount % currentParValue.Amount == 0;
    }

    private bool NotExceedTotalSubscribedAmount(AddPaymentAdjustmentCommand command)
    {
        var parentPayment = dataService.Payments.FirstOrDefault(p => p.Id == command.ParentPaymentId);
        if (parentPayment == null) return false;

        var latestSubscription = dataService.Subscriptions.Where(s => s.Id == parentPayment.SubscriptionId).FirstOrDefault();
        if (latestSubscription == null) return false;

        var otherPaymentsTotal = dataService.Payments.Where(p => p.SubscriptionId == latestSubscription.Id
                                                                && p.EffectiveDate <= DateTime.Now
                                                                && (p.EndDate == null || p.EndDate > DateTime.Now)).Sum(p => p.Amount);

        return otherPaymentsTotal + command.Amount <= latestSubscription.Amount;
    }
}
