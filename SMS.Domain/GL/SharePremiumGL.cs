namespace SMS.Domain.GL
{
    public class SharePremiumGL : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public int SubscriptionID { get; set; }
        public int ShareholderId { get; set; }
        public string SharePremiumGLNo { get; set; }
        public string SharePremiumGLName { get; set; }
        public decimal SharePremiumAmount { get; set; }
        public decimal SharePremiumBalance { get; set; }

    }
}
