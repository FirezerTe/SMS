namespace SMS.Domain;

public class DividendDecisionDocument : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public int DividendDecisionId { get; set; }
    public string DocumentId { get; set; }
    public DividendDecisionDocumentType DocumentType { get; set; }
    public string FileName { get; set; }
}
