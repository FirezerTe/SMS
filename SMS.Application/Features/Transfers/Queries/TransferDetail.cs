using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public class TransfereeDto : Transferee
{
    public ShareholderBasicInfo? Shareholder { get; set; }
    public decimal TransferredAmount { get; set; }

}
public class TransferDto
{
    public int Id { get; set; }
    public TransferTypeEnum TransferType { get; set; }
    public TransferDividendTermEnum DividendTerm { get; set; }
    public int FromShareholderId { get; set; }
    public ShareholderBasicInfo? FromShareholder { get; set; }
    public decimal TotalTransferAmount { get; set; }
    public decimal TotalTransferredAmount { get; set; }
    public decimal? SellValue { get; set; }
    public decimal? ServiceCharge { get; set; }
    public decimal? CapitalGainTax { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public DateOnly AgreementDate { get; set; }

    public int BranchId { get; set; }
    public int DistrictId { get; set; }
    public string? Note { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }

    public List<TransfereeDto> Transferees { get; set; }
    public List<TransferDocument> TransferDocuments { get; set; }
}
