using SMS.Domain.Enums;

namespace SMS.Application;

public class DividendDecisionDto : WorkflowEnabledEntityDto
{
    public int Id { get; set; }
    public DividendDecisionType Decision { get; set; }
    public DateOnly? DecisionDate { get; set; }
    public decimal CapitalizedAmount { get; set; }
    public decimal WithdrawnAmount { get; set; }
    public decimal FulfillmentPayment { get; set; }
    public decimal AdditionalSharesWillingToBuy { get; set; }
    public string? AttachmentDocumentId { get; set; }
    public string AttachmentDocumentFileName { get; set; }
    public decimal Tax { get; set; }
    public decimal NetPay { get; set; }
    public bool DecisionProcessed { get; set; }
    public bool TaxProcessed { get; set; }
    public int? BranchId { get; set; }
    public int? DistrictId { get; set; }

    public ShareholderDividendDto? Dividend { get; set; }
}
