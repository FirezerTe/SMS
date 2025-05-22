namespace SMS.Domain;

public class ShareholderChangeLog : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public int ShareholderId { get; set; }
    public ShareholderChangeLogEntityType EntityType { get; set; }
    public int EntityId { get; set; }
    public ChangeType ChangeType { get; set; }
}
