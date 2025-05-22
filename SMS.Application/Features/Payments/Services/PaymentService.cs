using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;


public class PaymentService : IPaymentService
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public PaymentService(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public Payment AddNewPayment(NewPaymentDto paymentData)
    {
        var payment = new Payment()
        {
            Amount = paymentData.Amount,
            SubscriptionId = paymentData.SubscriptionId,
            EffectiveDate = paymentData.PaymentDate,
            PaymentTypeEnum = paymentData.PaymentType,
            PaymentMethodEnum = paymentData.PaymentMethod,
            BranchId = paymentData.BranchId,
            DistrictId = paymentData.DistrictId,
            OriginalReferenceNo = paymentData.OriginalReferenceNo,
            PaymentReceiptNo = paymentData.PaymentReceiptNo,
            Note = paymentData.Note,
            ParentPaymentId = paymentData.parentPaymentId,
            ForeignCurrencyId = paymentData.ForeignCurrencyId,
            ForeignCurrencyAmount = paymentData.ForeignCurrencyAmount,
            GeneralLedgerEnum = GeneralLedgerTypeEnum.PaidUpCapital,
        };

        dataService.Payments.Add(payment);
        payment.AddDomainEvent(new PaymentAddedEvent(payment));
        return payment;
    }

    public async Task<Payment> AddNewPaymentAndSave(NewPaymentDto request,
                                           CancellationToken cancellationToken)
    {
        var payment = AddNewPayment(request);
        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogPaymentChange(payment, ChangeType.Added, cancellationToken);

        return payment;
    }



    public async Task<decimal?> ComputeSubscriptionPremiumPayment(decimal subscriptionAmount, int subscriptionGroupID)
    {
        var subscriptionGroup = await dataService.SubscriptionGroups.Include(s => s.SubscriptionPremium).FirstOrDefaultAsync(s => s.Id == subscriptionGroupID);
        if (subscriptionGroup == null) return null;

        var ranges = subscriptionGroup.SubscriptionPremium?.Ranges ?? new List<PremiumRange>();
        if (ranges.Count == 0) return null;

        var potentialRanges = ranges.Where((range) => range.UpperBound != null && range.UpperBound >= subscriptionAmount)
                                    .OrderBy(range => range.UpperBound);

        var applicableRange = potentialRanges.Count() > 0 ? potentialRanges.FirstOrDefault() : ranges.FirstOrDefault((x) => x.UpperBound == null);

        var percent = applicableRange?.Percentage ?? 0;

        return percent * subscriptionAmount / 100;
    }
}
