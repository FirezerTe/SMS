namespace SMS.Domain;

public class AllocationSubscriptionSummary : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public int AllocationId { get; set; }
    public decimal TotalApprovedSubscriptions { get; set; }
    public decimal TotalPendingApprovalSubscriptions { get; set; }
    public decimal TotalApprovedPayments { get; set; }
    public decimal TotalPendingApprovalPayments { get; set; }
    public DateTime AsOf { get; set; }

    public Allocation Allocation { get; set; }
}
