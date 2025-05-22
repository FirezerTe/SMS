using SMS.Common.Services.RigsWeb;

namespace SMS.Application.Features.EndOfDay.Models
{
    public class EodReconciliationDto
    {
        public int Id { get; set; }
        public string? TransactionReferenceNumber { get; set; }
        public string? GLNumber { get; set; }
        public decimal? SMSPaymentAmount { get; set; }
        public decimal? SMSPremiumAmount { get; set; }
        public decimal? CBSAmount { get; set; }
        public decimal? Difference { get; set; }
        public string? BranchName { get; set; }
        public EndOfDayDto EndOfDay { get; set; }

    }
}
