using SMS.Domain.Enums;

namespace SMS.Application;

public record PremiumRangeDto(decimal? UpperBound, decimal Percentage);
public record SubscriptionPremiumDto(int Id, bool? IsDefault, List<PremiumRangeDto> Ranges);

public class SubscriptionGroupInfo
{
    public int Id { get; set; }
    public int AllocationID { get; set; }
    public int? SubscriptionPremiumId { get; set; }
    public decimal? MinFirstPaymentAmount { get; set; }
    public PaymentUnit? MinFirstPaymentAmountUnit { get; set; }
    public DateOnly? ExpireDate { get; set; }
    public string Name { get; set; }
    public decimal? MinimumSubscriptionAmount { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public bool? IsDividendCapitalization { get; set; }
    public SubscriptionPremiumDto? SubscriptionPremium { get; set; } = null;
}
