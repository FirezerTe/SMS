namespace SMS.Domain
{
    public class SubscriptionPaymentReceipt : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public int PaymentId { get; set; }
        public string DocumentId { get; set; }
        public bool IsImage { get; set; }
        public string FileName { get; set; }
    }
}
