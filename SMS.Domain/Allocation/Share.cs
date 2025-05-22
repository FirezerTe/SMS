namespace SMS.Domain;

public class Share
{
    public int SerialNumber { get; set; }
    public decimal ParValue { get; set; }
    public int? PaymentId { get; set; }
    public Guid BankAllocationVersionNumber { get; set; }

    public Payment? Payment { get; set; }
}
