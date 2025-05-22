namespace SMS.Domain
{
    public class ParValue : WorkflowEnabledEntity
    {
        public decimal Amount { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}
