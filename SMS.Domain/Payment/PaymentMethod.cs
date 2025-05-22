using SMS.Domain.Enums;

namespace SMS.Domain
{
    public class PaymentMethod
    {
        public PaymentMethodEnum Value { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
