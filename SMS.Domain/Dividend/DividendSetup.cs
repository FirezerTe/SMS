using SMS.Domain.Enums;

namespace SMS.Domain;

public class DividendSetup : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public int DividendPeriodId { get; set; }
    public decimal DeclaredAmount { get; set; }
    public decimal DividendRate { get; set; }
    public decimal TaxRate { get; set; }
    public DateOnly DividendTaxDueDate { get; set; }
    public bool IsTaxApplicable { get; set; }
    public DividendDistributionStatus DistributionStatus { get; set; }
    public DividendRateComputationStatus DividendRateComputationStatus { get; set; }
    public decimal AdditionalAllocationAmount { get; set; }


    public decimal TotalSubscriptionPayments { get; set; }
    public decimal TotalWeightedAverageSubscriptionPayments { get; set; }
    public string? Description { get; set; }

    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    public string? ApprovedBy { get; set; }
    public DateOnly? ApprovedAt { get; set; }

    public DividendPeriod DividendPeriod { get; set; }
}
