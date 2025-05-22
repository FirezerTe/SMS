namespace SMS.Common;

public class DividendComputationResults
{
    public List<DividendComputationResult> Results { get; set; }

    public decimal TotalDividends { get; set; } = 0;
    public decimal TotalCapitalized { get; set; } = 0;
    public decimal TotalWithdrawn { get; set; } = 0;
    public decimal TotalTax { get; set; } = 0;
    public decimal TotalNetPay { get; set; } = 0;
    public decimal TotalFulfillment { get; set; } = 0;

}