using SMS.Domain.Enums;

namespace SMS.Application
{
    public record NewPaymentDto(
        decimal Amount,
        int SubscriptionId,
        GeneralLedgerTypeEnum? GeneralLedgerId,
        DateTime PaymentDate,
        PaymentTypeEnum PaymentType,
        PaymentMethodEnum PaymentMethod,
        int? ForeignCurrencyId,
        decimal? ForeignCurrencyAmount,
        int? DistrictId,
        int? BranchId,
        string? OriginalReferenceNo,
        string? PaymentReceiptNo,
        string? Note,
        int? parentPaymentId = null);

}
