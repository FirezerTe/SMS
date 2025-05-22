using SMS.Domain.Enums;

namespace SMS.Application;


public class SubscriptionPaymentReceiptDto
{
    public int Id { get; set; }
    public int PaymentId { get; set; }
    public string DocumentId { get; set; }
    public bool IsImage { get; set; }
    public string FileName { get; set; }
}

public class SubscriptionPaymentDto : WorkflowEnabledEntityDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public int SubscriptionId { get; set; }
    public DateTime EffectiveDate { get; set; }
    public DateTime? EndDate { get; set; }
    public PaymentTypeEnum PaymentTypeEnum { get; set; }
    public PaymentMethodEnum PaymentMethodEnum { get; set; }
    public int? ForeignCurrencyId { get; set; }
    public decimal? ForeignCurrencyAmount { get; set; }

    public int? TransferId { get; set; }
    public int? DistrictId { get; set; }
    public int? BranchId { get; set; }
    public string? OriginalReferenceNo { get; set; }
    public string? PaymentReceiptNo { get; set; }
    public string? Note { get; set; }
    public int? ParentPaymentId { get; set; }
    public bool HasChildPayment { get; set; }

    public bool IsReadOnly { get; set; }
    public SubscriptionPaymentDto? ParentPayment { get; set; }
    public List<SubscriptionPaymentReceiptDto> Receipts { get; set; }
    public List<SubscriptionPaymentDto> UnapprovedTransfers { get; set; } = new List<SubscriptionPaymentDto>();
    public List<SubscriptionPaymentDto> UnapprovedAdjustments { get; set; } = new List<SubscriptionPaymentDto>();

}
