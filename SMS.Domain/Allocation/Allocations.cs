using SMS.Domain.Enums;

namespace SMS.Domain;

public class Allocation : WorkflowEnabledEntity
{
    public string Name { get; set; }
    public decimal Amount { get; set; }
    public DateOnly FromDate { get; set; }
    public DateOnly? ToDate { get; set; }
    public AllocationType? AllocationType { get; set; }
    public string? Description { get; set; }
    public bool? IsOnlyForExistingShareholders { get; set; }
    public bool IsDividendAllocation { get; set; } = false;

    public AllocationSubscriptionSummary SubscriptionSummary { get; set; }

    public decimal AllocationTotalPaidUp { get; set; }
    public decimal AllocationRemaining { get; set; }
    public decimal AllocationPending { get; set; }
    public decimal AllocationReversal { get; set; }

    public ICollection<SubscriptionGroup> SubscriptionGroups { get; set; } = new List<SubscriptionGroup>();
}
