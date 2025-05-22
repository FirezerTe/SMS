using SMS.Domain.Common;
using SMS.Domain.Enums;

namespace SMS.Domain;

public class ShareholderDocument : AuditableSoftDeleteEntity
{
    public int Id { get; set; }
    public int ShareholderId { get; set; }
    public DocumentType DocumentType { get; set; }
    public string DocumentId { get; set; }
    public string FileName { get; set; }
}
