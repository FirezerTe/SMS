using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public class MakeSubscriptionPaymentCommandValidator : AbstractValidator<MakeSubscriptionPaymentCommand>
{
    private readonly IDataService dataService;
    private readonly IParValueService parValueService;
    private readonly IDividendService dividendService;

    public MakeSubscriptionPaymentCommandValidator(IDataService dataService, IParValueService parValueService, IDividendService dividendService)
    {
        this.dataService = dataService;
        this.parValueService = parValueService;
        this.dividendService = dividendService;
        RuleFor(p => p.payment.Amount).NotEmpty().WithMessage("Amount is required.");
        RuleFor(p => p.payment.PaymentDate).NotEmpty().WithMessage("Payment date is required.");
        RuleFor(p => p.payment.SubscriptionId).NotEmpty().WithMessage("Subscription is required.");
        RuleFor(p => p.payment.PaymentType).NotEmpty().WithMessage("Payment type is required.");
        RuleFor(p => p.payment.DistrictId).NotEmpty().WithMessage("District is required.");
        RuleFor(p => p.payment.BranchId).NotEmpty().WithMessage("Branch is required.");
        RuleFor(p => p.payment.PaymentDate).Must(ValidSubscriptionDate).WithMessage(x => "Payment date cannot be in the future.");
        RuleFor(p => p.payment.SubscriptionId).Must(ValidSubscription).WithMessage(x => $"Invalid subscription");
        RuleFor(p => p).Must(BeMultipleOfParValue).WithMessage(x => "Amount must be multiple of Par Value");
        RuleFor(p => p).Must(NotExceedTotalSubscribedAmount).WithMessage(x => "Total paid amount exceeds subscribed amount");
        RuleFor(p => p).Must(BeAfterLastDividendPeriodEndDate).WithMessage(x => "Invalid payment date. Dividend already paid for the selected date");
        RuleFor(p => p).MustAsync(HaveForeignCurrency).WithMessage(x => "Payment Currency is required");
        RuleFor(p => p).MustAsync(HaveForeignCurrencyPaymentAmount).WithMessage(x => "Payment Amount in Foreign Currency is required");
    }

    private async Task<bool> HaveForeignCurrencyPaymentAmount(MakeSubscriptionPaymentCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Subscriptions.Where(s => s.Id == command.payment.SubscriptionId).Select(s => s.Shareholder).FirstOrDefaultAsync();
        if (shareholder!.ShareholderType != Domain.Enums.ShareholderTypeEnum.Individual) return true;

        var country = await dataService.Countries.FirstOrDefaultAsync(c => c.Id == shareholder.CountryOfCitizenship);
        if (country?.Code == "ETH") return true;

        return command.payment.ForeignCurrencyAmount != null && command.payment.ForeignCurrencyAmount >= 0;
    }

    private async Task<bool> HaveForeignCurrency(MakeSubscriptionPaymentCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Subscriptions.Where(s => s.Id == command.payment.SubscriptionId).Select(s => s.Shareholder).FirstOrDefaultAsync();
        if (shareholder!.ShareholderType != Domain.Enums.ShareholderTypeEnum.Individual) return true;

        var country = await dataService.Countries.FirstOrDefaultAsync(c => c.Id == shareholder.CountryOfCitizenship);
        if (country?.Code == "ETH") return true;

        return command.payment.ForeignCurrencyId != null && command.payment.ForeignCurrencyId >= 0;
    }

    private bool BeAfterLastDividendPeriodEndDate(MakeSubscriptionPaymentCommand command)
    {
        var currentDividendPeriod = dividendService.GetCurrentDividendPeriod().GetAwaiter().GetResult();

        return currentDividendPeriod != null && DateOnly.FromDateTime(command.payment.PaymentDate) >= currentDividendPeriod.StartDate;
    }

    private bool ValidSubscriptionDate(DateTime subscriptionDate) => subscriptionDate <= DateTime.Now;

    private bool ValidSubscription(int subscriptionId) => dataService.Subscriptions.Any(x => x.Id == subscriptionId);

    private bool BeMultipleOfParValue(MakeSubscriptionPaymentCommand command)
    {
        var currentParValue = parValueService.GetCurrentParValue().GetAwaiter().GetResult();

        return currentParValue != null && command.payment.Amount % currentParValue.Amount == 0;
    }

    private bool NotExceedTotalSubscribedAmount(MakeSubscriptionPaymentCommand command)
    {
        var latestSubscription = dataService.Subscriptions.Where(s => s.Id == command.payment.SubscriptionId).FirstOrDefault();
        if (latestSubscription == null) return false;

        var otherPaymentsTotal = dataService.Payments.Where(p => p.SubscriptionId == latestSubscription.Id
                                                                    && (p.EndDate == null || p.EndDate > DateTime.Now)).Sum(p => p.Amount);
        return otherPaymentsTotal + command.payment.Amount <= latestSubscription.Amount;
    }
}
