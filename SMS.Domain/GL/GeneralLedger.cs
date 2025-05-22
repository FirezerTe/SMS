namespace SMS.Domain.GL
{
    public class GeneralLedger
    {
        public Guid Id { get; set; }
        public string GLNumber { get; set; }
        public Enums.GeneralLedgerTypeEnum Value { get; set; }
        public string Description { get; set; }
        public string AccountType { get; set; }
        public string TransactionType { get; set; }
    }
}
