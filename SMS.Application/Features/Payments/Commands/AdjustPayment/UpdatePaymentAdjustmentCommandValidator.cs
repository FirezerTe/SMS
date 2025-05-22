using FluentValidation;

namespace SMS.Application;

public class UpdatePaymentAdjustmentCommandValidator : AbstractValidator<UpdatePaymentAdjustmentCommand>
{
    private readonly IDataService dataService;
    private readonly IParValueService parValueService;

    public UpdatePaymentAdjustmentCommandValidator(IDataService dataService, IParValueService parValueService)
    {
        this.dataService = dataService;
        this.parValueService = parValueService;
        RuleFor(p => p.PaymentId).Must(Exist).WithMessage(x => "Unable to find payment");
        RuleFor(p => p).Must(BeUnapprovedPayment).WithMessage(x => "Cannot modify approved payment");
        RuleFor(p => p).Must(BeMultipleOfParValue).WithMessage(x => "Adjustment Amount must be multiple of Par Value");
        RuleFor(p => p).Must(NotExceedTotalSubscribedAmount).WithMessage(x => "Total paid amount exceeds subscribed amount");
        RuleFor(p => p.PaymentType).NotEmpty().WithMessage("Payment type is required.");
        RuleFor(p => p.DistrictId).NotEmpty().WithMessage("District is required.");
        RuleFor(p => p.BranchId).NotEmpty().WithMessage("Branch is required.");
    }

    public bool Exist(int id)
    {
        var payment = dataService.Payments.FirstOrDefault(s => s.Id == id);
        return payment != null;
    }

    private bool BeUnapprovedPayment(UpdatePaymentAdjustmentCommand command)
    {
        var payment = dataService.Payments.FirstOrDefault(s => s.Id == command.PaymentId);
        return payment != null && payment.ApprovalStatus != Domain.Enums.ApprovalStatus.Approved;
    }

    private bool BeMultipleOfParValue(UpdatePaymentAdjustmentCommand command)
    {
        var currentParValue = parValueService.GetCurrentParValue().GetAwaiter().GetResult();

        return currentParValue != null && command.Amount % currentParValue.Amount == 0;
    }

    private bool NotExceedTotalSubscribedAmount(UpdatePaymentAdjustmentCommand command)
    {
        var payment = dataService.Payments.FirstOrDefault(p => p.Id == command.PaymentId);
        if (payment == null) return false;


        var latestSubscription = dataService.Subscriptions.Where(s => s.Id == payment.SubscriptionId).FirstOrDefault();
        if (latestSubscription == null) return false;

        var otherPaymentsTotal = dataService.Payments.Where(p => p.SubscriptionId == latestSubscription.Id
                                                                    && p.Id != command.PaymentId
                                                                    && p.EffectiveDate <= DateTime.Now
                                                                    && (p.EndDate == null || p.EndDate > DateTime.Now))
                                                        .Sum(p => p.Amount);

        return otherPaymentsTotal + command.Amount <= latestSubscription.Amount;
    }
}
