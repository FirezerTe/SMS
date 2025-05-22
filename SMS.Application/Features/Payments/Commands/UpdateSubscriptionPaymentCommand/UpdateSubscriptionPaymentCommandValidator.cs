using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public class UpdateSubscriptionPaymentCommandValidator : AbstractValidator<UpdateSubscriptionPaymentCommand>
{
    private readonly IDataService dataService;
    private readonly IParValueService parValueService;
    private readonly IDividendService dividendService;

    public UpdateSubscriptionPaymentCommandValidator(IDataService dataService, IParValueService parValueService, IDividendService dividendService)
    {
        this.dataService = dataService;
        this.parValueService = parValueService;
        this.dividendService = dividendService;
        RuleFor(p => p.Amount).NotEmpty().WithMessage("Amount is required.");
        RuleFor(p => p.PaymentDate).NotEmpty().WithMessage("Payment date is required.");
        RuleFor(p => p.SubscriptionId).NotEmpty().WithMessage("Subscription is required.");
        RuleFor(p => p.PaymentType).NotEmpty().WithMessage("Payment type is required.");
        RuleFor(p => p.DistrictId).NotEmpty().WithMessage("District is required.");
        RuleFor(p => p.BranchId).NotEmpty().WithMessage("Branch is required.");
        RuleFor(p => p.Id).Must(Exist).WithMessage(x => "Unable to find payment");
        RuleFor(p => p).Must(BeUnapprovedPayment).WithMessage(x => "Cannot modify approved payment.");
        RuleFor(p => p.PaymentDate).Must(HaveValidSubscriptionDate).WithMessage(x => "Payment date cannot be in the future.");
        RuleFor(p => p.SubscriptionId).Must(BeValidSubscription).WithMessage(x => $"Invalid subscription");
        RuleFor(p => p).Must(PaymentBelongsToSubscription).WithMessage(x => "Invalid request.");
        RuleFor(p => p).Must(BeMultipleOfParValue).WithMessage(x => "Amount must be multiple of Par Value");
        RuleFor(p => p).Must(NotExceedTotalSubscribedAmount).WithMessage(x => "Total paid amount exceeds subscribed amount");
        RuleFor(p => p).Must(BeAfterLastDividendPeriodEndDate).WithMessage(x => "Invalid payment date. Dividend already paid for the selected date");
        RuleFor(p => p).MustAsync(HaveForeignCurrency).WithMessage(x => "Payment Currency is required");
        RuleFor(p => p).MustAsync(HaveForeignCurrencyPaymentAmount).WithMessage(x => "Payment Amount in Foreign Currency is required");
    }

    private async Task<bool> HaveForeignCurrencyPaymentAmount(UpdateSubscriptionPaymentCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Subscriptions.Where(s => s.Id == command.SubscriptionId).Select(s => s.Shareholder).FirstOrDefaultAsync();
        if (shareholder!.ShareholderType != Domain.Enums.ShareholderTypeEnum.Individual) return true;

        var country = await dataService.Countries.FirstOrDefaultAsync(c => c.Id == shareholder.CountryOfCitizenship);
        if (country?.Code == "ETH") return true;

        return command.ForeignCurrencyAmount != null && command.ForeignCurrencyAmount >= 0;
    }

    private async Task<bool> HaveForeignCurrency(UpdateSubscriptionPaymentCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Subscriptions.Where(s => s.Id == command.SubscriptionId).Select(s => s.Shareholder).FirstOrDefaultAsync();
        if (shareholder!.ShareholderType != Domain.Enums.ShareholderTypeEnum.Individual) return true;

        var country = await dataService.Countries.FirstOrDefaultAsync(c => c.Id == shareholder.CountryOfCitizenship);
        if (country?.Code == "ETH") return true;

        return command.ForeignCurrencyId != null && command.ForeignCurrencyId >= 0;
    }

    private bool BeAfterLastDividendPeriodEndDate(UpdateSubscriptionPaymentCommand command)
    {
        var currentDividendPeriod = dividendService.GetCurrentDividendPeriod().GetAwaiter().GetResult();

        return currentDividendPeriod != null && DateOnly.FromDateTime(command.PaymentDate) >= currentDividendPeriod.StartDate;
    }


    private bool NotExceedTotalSubscribedAmount(UpdateSubscriptionPaymentCommand command)
    {
        var latestSubscriptionAmount = dataService.Subscriptions.Where(s => s.Id == command.SubscriptionId).Select(x => x.Amount).FirstOrDefault();
        var otherPaymentsTotal = dataService.Payments.Where(p => p.SubscriptionId == command.SubscriptionId
                                                                    && p.Id != command.Id
                                                                    && (p.EndDate == null || p.EndDate > DateTime.Now)).Sum(p => p.Amount);
        return otherPaymentsTotal + command.Amount <= latestSubscriptionAmount;
    }

    private bool BeUnapprovedPayment(UpdateSubscriptionPaymentCommand command)
    {
        var payment = dataService.Payments.FirstOrDefault(s => s.Id == command.Id);
        return payment != null && payment.ApprovalStatus != Domain.Enums.ApprovalStatus.Approved;
    }

    public bool Exist(int id) => dataService.Payments.FirstOrDefault(s => s.Id == id) != null;

    private bool PaymentBelongsToSubscription(UpdateSubscriptionPaymentCommand command) =>
        dataService.Payments.Any(s => s.Id == command.Id && s.SubscriptionId == command.SubscriptionId);

    private bool HaveValidSubscriptionDate(DateTime subscriptionDate) => subscriptionDate <= DateTime.Now;

    private bool BeValidSubscription(int subscriptionId) => dataService.Subscriptions.Any(x => x.Id == subscriptionId);

    private bool BeMultipleOfParValue(UpdateSubscriptionPaymentCommand command)
    {
        var currentParValue = parValueService.GetCurrentParValue().GetAwaiter().GetResult();

        return currentParValue != null && command.Amount % currentParValue.Amount == 0;
    }
}
