using SMS.Domain.Enums;

namespace SMS.Domain
{
    public class SubscriptionType
    {
        public SubscriptionTypeEnum Value { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
    }
}
