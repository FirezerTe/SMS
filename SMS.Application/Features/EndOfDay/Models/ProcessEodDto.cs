namespace SMS.Application.Features.EndOfDay.Models
{
    public class ProcessEodDto
    {
        public string BranchShareGl { get; set; }
        public decimal Amount { get; set; }
        public string TransactionType { get; set; }
        public string AccountType { get; set; }
        public string? TransactionreferenceNumber { get; set; }
    }
}
