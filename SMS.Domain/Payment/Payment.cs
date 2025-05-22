using SMS.Domain.Enums;
using SMS.Domain.Lookups;

namespace SMS.Domain
{
    public class Payment : WorkflowEnabledEntity
    {
        public decimal Amount { get; set; }
        public int SubscriptionId { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime? EndDate { get; set; }
        public PaymentTypeEnum PaymentTypeEnum { get; set; }
        public PaymentType? PaymentType { get; set; }
        public PaymentMethodEnum PaymentMethodEnum { get; set; }
        public int? ForeignCurrencyId { get; set; }
        public decimal? ForeignCurrencyAmount { get; set; }
        public bool? IsPosted { get; set; } = false;
        public PaymentMethod PaymentMethod { get; set; }
        public int? ParentPaymentId { get; set; }
        public int? DistrictId { get; set; }
        public int? BranchId { get; set; }
        public string? OriginalReferenceNo { get; set; }
        public string? PaymentReceiptNo { get; set; }
        public string? Note { get; set; }
        public GeneralLedgerTypeEnum GeneralLedgerEnum { get; set; }
        public District District { get; set; }
        public Branch Branch { get; set; }
        public ForeignCurrencyType ForeignCurrency { get; set; }
        public Subscription Subscription { get; set; }

        public Payment? ParentPayment { get; set; }

        public List<SubscriptionPaymentReceipt> Receipts { get; set; }

        public List<Share> Shares { get; set; }
        public ICollection<PaymentsWeightedAverage> PaymentsWeightedAverages { get; set; }
    }
}
