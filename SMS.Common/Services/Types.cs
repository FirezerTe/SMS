using SMS.Domain.Enums;

namespace SMS.Common;

public class DividendComputationResult
{
    public int Id { get; set; }
    public DividendDecisionType Decision { get; set; }
    public decimal CapitalizedAmount { get; set; }
    public decimal FulfillmentAmount { get; set; }
    public decimal WithdrawnAmount { get; set; }
    public decimal NetPay { get; set; }
    public decimal Tax { get; set; }
}