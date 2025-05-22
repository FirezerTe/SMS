using SMS.Domain.Enums;

namespace SMS.Domain;

public class SubscriptionGroup : AuditableEntity, IEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int AllocationID { get; set; }
    public int? SubscriptionPremiumId { get; set; }
    public decimal? MinFirstPaymentAmount { get; set; }
    public PaymentUnit? MinFirstPaymentAmountUnit { get; set; }
    public DateOnly? ExpireDate { get; set; }
    public decimal MinimumSubscriptionAmount { get; set; }
    public string? Description { get; set; }
    public bool? IsDividendCapitalization { get; set; }

    public bool IsActive => ExpireDate == null || ExpireDate >= DateOnly.FromDateTime(DateTime.Now);

    public SubscriptionPremium? SubscriptionPremium { get; set; } = null;

    public Allocation Allocation { get; set; }

    public ICollection<Subscription> Subscriptions { get; set; }
}
