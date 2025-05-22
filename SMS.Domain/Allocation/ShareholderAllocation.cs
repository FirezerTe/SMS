namespace SMS.Domain;

public class ShareholderAllocation : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public int AllocationId { get; set; }
    public int ShareholderId { get; set; }

    public decimal? MaxPurchaseLimit { get; set; }
}
