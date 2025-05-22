using SMS.Domain.Enums;

namespace SMS.Domain
{
    public class PaymentType
    {
        public PaymentTypeEnum Value { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
    }
}
