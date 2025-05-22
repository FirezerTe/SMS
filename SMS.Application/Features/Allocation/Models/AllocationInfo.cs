namespace SMS.Application;

public class AllocationInfo
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Amount { get; set; }
    public DateOnly FromDate { get; set; }
    public DateOnly? ToDate { get; set; }
    public bool IsActive { get; set; }
    public bool IsLatestRecord { get; set; }
    public bool? IsOnlyForExistingShareholders { get; set; }
    public bool IsDividendAllocation { get; set; } = false;
    public string Description { get; set; }
}
