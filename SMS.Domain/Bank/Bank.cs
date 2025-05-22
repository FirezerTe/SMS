namespace SMS.Domain.Bank
{
    public class Bank : WorkflowEnabledEntity
    {
        public decimal Amount { get; set; }
        public string Name { get; set; }
        public decimal? MaxPercentagePurchaseLimit { get; set; }
        public string? Description { get; set; }
    }
}
