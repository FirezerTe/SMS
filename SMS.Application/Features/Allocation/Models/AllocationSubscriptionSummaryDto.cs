using SMS.Domain.Enums;

namespace SMS.Application;

public class AllocationSubscriptionSummaryDto
{
    public int Id { get; set; }
    public int AllocationId { get; set; }

    public decimal TotalAllocation { get; set; }

    //subscription
    public decimal TotalApprovedSubscriptions { get; set; }
    public decimal TotalPendingApprovalSubscriptions { get; set; }
    public int? LastSubscriptionId { get; set; }
    public ApprovalStatus? LastSubscriptionApprovalStatus { get; set; }
    public decimal? LastSubscriptionAmount { get; set; }

    //payment
    public decimal TotalApprovedPayments { get; set; }
    public decimal TotalPendingApprovalPayments { get; set; }
    public int? LastPaymentId { get; set; }
    public ApprovalStatus? LastPaymentApprovalStatus { get; set; }
    public decimal? LastPaymentAmount { get; set; }

    public string AllocationName { get; set; }
    public string AllocationDescription { get; set; }
    public bool? IsOnlyForExistingShareholders { get; set; }
    public bool? IsDividendAllocation { get; set; }

    public string? Note { get; set; }
}
