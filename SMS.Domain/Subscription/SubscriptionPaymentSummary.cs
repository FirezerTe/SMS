namespace SMS.Domain
{
    public class SubscriptionPaymentSummary : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public int SubscriptionId { get; set; }
        public decimal TotalApprovedPayments { get; set; }
        public decimal TotalPendingApprovalPayments { get; set; }

        public DateTime AsOf { get; set; }

        public Subscription Subscription { get; set; }
    }
}
