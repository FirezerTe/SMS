namespace SMS.Common.Services.RigsWeb
{
    public class EndOfDayDto
    {
        public int? Id { get; set; }
        public DateTime Date { get; set; }
        public int? SubscriptionId { get; set; }
        public decimal Amount { get; set; }
        public string? BranchName { get; set; }
        public string BranchShareGl { get; set; }
        public string? PaymentReceiptNo { get; set; }
        public string AccountType { get; set; }
        public string TransactionType { get; set; }
        public string? Description { get; set; }
        public string? TransactionReference { get; set; }
        public string? PaymentType { get; set; }
        public bool? IsPosted { get; set; }
    }
}