using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.SeedData
{
    public static class PaymentMethodsSeedData
    {
        public static async Task SeedAsync(SMSDbContext ctx)
        {
            if (ctx.PaymentMethods.Any()) return;

            var paymentMethods = new List<PaymentMethod>() {
               new PaymentMethod { Value= PaymentMethodEnum.FromAccount, Name="From Account", Description="From Account"},
               new PaymentMethod { Value= PaymentMethodEnum.Cash, Name="Cash", Description="Cash"},
               new PaymentMethod { Value= PaymentMethodEnum.Check, Name="Check", Description="Check"},
               new PaymentMethod { Value= PaymentMethodEnum.DividendCapitalization, Name="Dividend Capitalization", Description="Dividend Capitalization"},
               new PaymentMethod { Value= PaymentMethodEnum.Transfer, Name="Transfer", Description="Transfer"},
               new PaymentMethod { Value= PaymentMethodEnum.CreditCard, Name="Credit Card", Description="Credit Card"},
               new PaymentMethod { Value= PaymentMethodEnum.Other, Name="Other", Description="Other"}
            };

            await ctx.PaymentMethods.AddRangeAsync(paymentMethods);
        }
    }
}
