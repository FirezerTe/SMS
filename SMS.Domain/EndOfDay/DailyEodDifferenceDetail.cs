namespace SMS.Domain.EndOfDay
{
    public class DailyEodDifferenceDetail : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public decimal? SMSPaymentAmount { get; set; }
        public decimal? SMSPremiumAmount { get; set; }
        public decimal? CBSAmount { get; set; }
        public string? Description { get; set; }
        public DateOnly? EodDate { get; set; }
        public string? TransactionReferenceNumber { get; set; }
        public string? BusinessUnit { get; set; }
        public string? GLNumber { get; set; }
    }
}
