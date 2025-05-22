namespace SMS.Domain;

public class ShareholderSubscriptionSummary : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public int ShareholderId { get; set; }
    public decimal ApprovedSubscriptionAmount { get; set; } = 0;
    public decimal PendingApprovalSubscriptionAmount { get; set; } = 0;
    public decimal ApprovedPaymentsAmount { get; set; } = 0;
    public decimal PendingApprovalPaymentsAmount { get; set; } = 0;

    public DateTime AsOf { get; set; } = DateTime.Now;
}
