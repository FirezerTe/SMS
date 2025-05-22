using SMS.Domain.Enums;

namespace SMS.Domain;

public class SubscriptionDocument : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public int SubscriptionId { get; set; }
    public string DocumentId { get; set; }
    public DocumentType DocumentType { get; set; }
    public bool IsImage { get; set; }
    public string FileName { get; set; }
}
