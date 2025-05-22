namespace SMS.Domain;

public class TransferredPayment
{
    public int PaymentId { get; set; }
    public decimal Amount { get; set; }
}

public class Transferee
{
    public int ShareholderId { get; set; }
    public decimal Amount { get; set; }

    public ICollection<TransferredPayment> Payments { get; set; } = new List<TransferredPayment>();
}

public class Transfer : WorkflowEnabledEntity
{
    public TransferTypeEnum TransferType { get; set; }
    public TransferDividendTermEnum DividendTerm { get; set; }
    public int FromShareholderId { get; set; }
    public decimal TotalTransferAmount { get; set; }
    public decimal? ServiceCharge { get; set; }
    public decimal? SellValue { get; set; }
    public decimal? CapitalGainTax { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public DateOnly AgreementDate { get; set; }
    public int BranchId { get; set; }
    public int DistrictId { get; set; }
    public string? Note { get; set; }

    public required List<Transferee> Transferees { get; set; }

}
