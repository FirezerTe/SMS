using SMS.Domain.Enums;

namespace SMS.Domain;

public class DividendDecision : WorkflowEnabledEntity
{
    public int DividendId { get; set; }
    public DividendDecisionType Decision { get; set; }
    public DateOnly? DecisionDate { get; set; }
    public decimal CapitalizedAmount { get; set; }
    public decimal WithdrawnAmount { get; set; }
    public decimal FulfillmentPayment { get; set; }
    public decimal Tax { get; set; }
    public decimal NetPay { get; set; }
    public bool DecisionProcessed { get; set; }
    public bool TaxApplied { get; set; }
    public bool TaxProcessed { get; set; }
    public decimal AdditionalSharesWillingToBuy { get; set; }

    public string? AttachmentDocumentId { get; set; }
    public string? AttachmentDocumentFileName { get; set; }

    public int? BranchId { get; set; }
    public int? DistrictId { get; set; }
    public Dividend Dividend { get; set; }
}
