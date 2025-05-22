using SMS.Domain.Enums;

namespace SMS.Domain;

public class BlockedShareholderAttachment
{
    public string DocumentId { get; set; }
    public bool IsImage { get; set; }
    public string FileName { get; set; }
}


public class BlockedShareholder : WorkflowEnabledEntity
{
    public double? Amount { get; set; }
    public ShareUnit? Unit { get; set; }
    public string Description { get; set; }
    public DateTime? BlockedTill { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public bool? IsActive { get; set; }
    public int ShareholderId { get; set; }
    public int BlockTypeId { get; set; }
    public int BlockReasonId { get; set; }
    public List<BlockedShareholderAttachment> Attachments { get; set; }


    public ShareholderBlockType BlockType { get; set; }
    public ShareholderBlockReason BlockReason { get; set; }

}
