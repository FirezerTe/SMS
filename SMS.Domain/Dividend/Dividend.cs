using SMS.Domain.Enums;

namespace SMS.Domain;

public class Dividend : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public int ShareholderId { get; set; }
    public int DividendSetupId { get; set; }
    public decimal TotalPaidAmount { get; set; }
    public decimal TotalPaidWeightedAverage { get; set; }
    public decimal DividendAmount { get; set; }
    public decimal CapitalizeLimit { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    public DividendSetup DividendSetup { get; set; }
    public Shareholder Shareholder { get; set; }
    public DividendDecision? DividendDecision { get; set; }
}
