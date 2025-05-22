using SMS.Domain;

namespace SMS.Application
{
    public interface IPaymentService
    {
        Payment AddNewPayment(NewPaymentDto payment);
        Task<Payment> AddNewPaymentAndSave(NewPaymentDto payment, CancellationToken token);
        Task<decimal?> ComputeSubscriptionPremiumPayment(decimal subscriptionAmount, int subscriptionGroupID);
    }
}