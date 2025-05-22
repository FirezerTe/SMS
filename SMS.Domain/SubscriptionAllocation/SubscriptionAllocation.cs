namespace SMS.Domain.SubscriptionAllocation
{
    public class SubscriptionAllocation : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public int ShareholderId { get; set; }
        public int AllocationID { get; set; }
        public decimal SubscriptionAllocationAmount { get; set; }
        public DateTime ExpireDate { get; set; }
    }
}
