using SMS.Domain.Enums;

namespace SMS.Application.Features.EndOfDay.Models
{
    public class GeneralLedgerDto
    {
        public string GLNumber { get; set; }
        public GeneralLedgerTypeEnum Value { get; set; }
        public string Description { get; set; }
        public string AccountType { get; set; }
        public string TransactionType { get; set; }
    }
}
