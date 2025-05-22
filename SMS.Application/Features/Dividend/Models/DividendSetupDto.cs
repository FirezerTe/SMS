using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public class DividendSetupDto
{
    public int Id { get; set; }
    public int DividendPeriodId { get; set; }
    public decimal DeclaredAmount { get; set; }
    public decimal DividendRate { get; set; }
    public decimal TaxRate { get; set; }
    public DateOnly DividendTaxDueDate { get; set; }
    public bool IsTaxApplicable { get; set; }
    public bool HasPendingDecision { get; set; }
    public bool TaxApplied { get; set; }
    public decimal AdditionalAllocationAmount { get; set; }

    public DividendDistributionStatus DistributionStatus { get; set; }
    public DividendRateComputationStatus DividendRateComputationStatus { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public decimal TotalSubscriptionPayments { get; set; }
    public decimal TotalWeightedAverageSubscriptionPayments { get; set; }
    public string? Description { get; set; }
}
