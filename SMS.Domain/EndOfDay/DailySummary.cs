namespace SMS.Domain.EndOfDay
{
    public class DailySummary : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public decimal? TotalDailySuspenseAmount { get; set; }
        public decimal? TotalDailyPremiumAmount { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalDailyPaidupAmount { get; set; }
        public string BatchReferenceNumber { get; set; }
    }
}
