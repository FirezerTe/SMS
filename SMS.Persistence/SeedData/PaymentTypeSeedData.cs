using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.SeedData
{
    public static class PaymentTypeSeedData
    {

        public static async Task SeedAsync(SMSDbContext ctx)
        {
            if (ctx.PaymentTypes.Any()) return;

            var paymentTypes = new List<PaymentType>() {
               new PaymentType {
                   Value=PaymentTypeEnum.SubscriptionPayment,
                   Description="Subscription Payment",
                   DisplayName="Subscription Payment"
               },

               new PaymentType {
                   Value=PaymentTypeEnum.DividendCapitalize,
                   Description="Dividend Capitalize",
                   DisplayName="Dividend Capitalize"
               },
               new PaymentType {
                   Value=PaymentTypeEnum.TransferPayment,
                   Description="Transfer Payment",
                   DisplayName="Transfer Payment"
                },
               new PaymentType {
                   Value=PaymentTypeEnum.Reversal,
                   Description="Reversal",
                   DisplayName="Reversal"
                },
               new PaymentType {
                   Value=PaymentTypeEnum.Correction,
                   Description="Correction",
                   DisplayName="Correction"
                }
            };

            await ctx.PaymentTypes.AddRangeAsync(paymentTypes);
        }


    }
}
