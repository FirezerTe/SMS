namespace SMS.Application
{
    public record SubscriptionPaymentSummaryDto(
        int SubscriptionId,
        decimal TotalApprovedPayments,
        decimal TotalPendingApprovalPayments);
}
