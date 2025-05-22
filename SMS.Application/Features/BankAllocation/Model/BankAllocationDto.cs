namespace SMS.Application;

public class BankAllocationDto : WorkflowEnabledEntityDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Name { get; set; }
    public decimal? MaxPercentagePurchaseLimit { get; set; }

    public string? Description { get; set; }
}
