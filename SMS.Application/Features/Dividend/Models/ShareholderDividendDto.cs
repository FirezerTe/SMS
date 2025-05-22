namespace SMS.Application;

public class ShareholderDividendDto
{
    public int Id { get; set; }
    public int ShareholderId { get; set; }
    public int DividendSetupId { get; set; }
    public decimal TotalPaidAmount { get; set; }
    public decimal TotalPaidWeightedAverage { get; set; }
    public decimal DividendAmount { get; set; }
    public decimal CapitalizeLimit { get; set; }

    public DividendSetupDto DividendSetup { get; set; }

}
