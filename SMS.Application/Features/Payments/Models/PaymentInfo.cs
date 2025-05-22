using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Payments.Models
{
    public class PaymentInfo
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int SubscriptionId { get; set; }
        public string EffectiveDate { get; set; }
        public DateTime? EndDate { get; set; }
        public PaymentTypeEnum PaymentTypeEnum { get; set; }
        public PaymentType? PaymentType { get; set; }
        public PaymentMethodEnum PaymentMethodEnum { get; set; }
        public int? ForeignCurrencyId { get; set; }
        public decimal? ForeignCurrencyAmount { get; set; }
        public bool? IsPosted { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public int? ParentPaymentId { get; set; }
        public int? DistrictId { get; set; }
        public int? BranchId { get; set; }
        public string? OriginalReferenceNo { get; set; }
        public string? PaymentReceiptNo { get; set; }
        public string? Note { get; set; }
        public GeneralLedgerTypeEnum? GeneralLedgerEnum { get; set; }
    }
}
