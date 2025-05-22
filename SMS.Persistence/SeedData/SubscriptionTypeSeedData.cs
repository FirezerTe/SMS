using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.SeedData
{
    public static class SubscriptionTypeSeedData
    {

        public static async Task SeedAsync(SMSDbContext ctx)
        {
            if (ctx.PaymentTypes.Any()) return;

            var paymentTypes = new List<SubscriptionType>() {
               new SubscriptionType {
                   Value=SubscriptionTypeEnum.New,
                   Description="New",
                   DisplayName="New Subscription"
               },
               new SubscriptionType {
                   Value=SubscriptionTypeEnum.StaffAward,
                   Description="Staff Award",
                   DisplayName="Staff Award"
               },new SubscriptionType {
                   Value=SubscriptionTypeEnum.Transfer,
                   Description="Transfer",
                   DisplayName="Transfer"
               },new SubscriptionType {
                   Value=SubscriptionTypeEnum.AdditionalSharePurchase,
                   Description="AdditionalSharePurchase",
                   DisplayName="AdditionalSharePurchase"
               }
               ,new SubscriptionType {
                   Value=SubscriptionTypeEnum.DividendCapitalize,
                   Description="DividendCapitalize",
                   DisplayName="DividendCapitalize"
               }
            };

            await ctx.SubscriptionTypes.AddRangeAsync(paymentTypes);
        }
    }
}
