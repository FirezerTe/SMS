using SMS.Domain.Enums;

namespace SMS.Application;

public class SubscriptionDocumentDto
{
    public int Id { get; set; }
    public int SubscriptionId { get; set; }
    public string DocumentId { get; set; }
    public DocumentType DocumentType { get; set; }
    public bool IsImage { get; set; }
    public string FileName { get; set; }
}
