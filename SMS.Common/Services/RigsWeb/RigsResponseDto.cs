namespace SMS.Common.Services.RigsWeb
{
    public class RigsResponseDto
    {
        public string? BatchReferenceNumber { get; set; }
        public decimal? TotalDailySuspenseAmount { get; set; }
        public decimal? TotalDailyPremiumAmount { get; set; }
        public string? Description { get; set; }
        public DateTime? Date { get; set; }
        public decimal? TotalDailyPaidupAmount { get; set; }
    }
}