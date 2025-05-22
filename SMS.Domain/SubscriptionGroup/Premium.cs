namespace SMS.Domain;

public class PremiumRange
{
    public decimal? UpperBound { get; set; }
    public decimal Percentage { get; set; }
}

public class SubscriptionPremium : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public bool? IsDefault { get; set; }
    public required List<PremiumRange> Ranges { get; set; }
}
