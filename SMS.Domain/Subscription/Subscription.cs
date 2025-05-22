using SMS.Domain.Enums;
using SMS.Domain.Lookups;

namespace SMS.Domain
{
    public class Subscription : WorkflowEnabledEntity
    {
        public decimal Amount { get; set; }
        public DateTime SubscriptionDate { get; set; }
        public DateOnly SubscriptionPaymentDueDate { get; set; }

        public int ShareholderId { get; set; }
        public int SubscriptionGroupID { get; set; }
        public int? SubscriptionDistrictID { get; set; }
        public int? SubscriptionBranchID { get; set; }
        public int? DividendDescisionId { get; set; }
        public string? SubscriptionOriginalReferenceNo { get; set; }
        public string? PremiumPaymentReceiptNo { get; set; }
        public SubscriptionTypeEnum SubscriptionType { get; set; }
        public SubscriptionType Type { get; set; }
        public decimal? PremiumPayment { get; set; }
        public bool? IsPosted { get; set; } = false;
        public Shareholder Shareholder { get; set; }
        public SubscriptionGroup SubscriptionGroup { get; set; }
        public District District { get; set; }
        public Branch Branch { get; set; }
        public SubscriptionPaymentSummary SubscriptionSummary { get; set; }

        public ICollection<Payment> Payments { get; set; }
    }
}
