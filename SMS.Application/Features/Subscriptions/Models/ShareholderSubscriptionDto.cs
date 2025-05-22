namespace SMS.Application
{
    public class ShareholderSubscriptionDto : WorkflowEnabledEntityDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime? SubscriptionDate { get; set; }
        public DateOnly SubscriptionPaymentDueDate { get; set; }
        public int ShareholderId { get; set; }
        public int SubscriptionGroupID { get; set; }
        public int? SubscriptionDistrictID { get; set; }
        public int? SubscriptionBranchID { get; set; }
        public string? SubscriptionOriginalReferenceNo { get; set; }
        public string? PremiumPaymentReceiptNo { get; set; }
        public decimal? PremiumPayment { get; set; }
        public SubscriptionPaymentSummaryDto? PaymentSummary { get; set; }
    }
}
