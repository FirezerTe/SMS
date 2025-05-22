namespace SMS.Domain;

public class TransferDocument
{
    public int Id { get; set; }
    public TransferDocumentType DocumentType { get; set; }
    public int TransferId { get; set; }
    public string DocumentId { get; set; }
    public bool IsImage { get; set; }
    public string FileName { get; set; }
}
