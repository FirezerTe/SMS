using SMS.Domain;

namespace SMS.Persistence.SeedData
{
    public static class TransferDividendTermsSeedData
    {
        public static async Task SeedAsync(SMSDbContext ctx)
        {
            if (ctx.TransferDividendTerms.Any()) return;

            var transferDividendTerms = new List<TransferDividendTerm>() {
               new TransferDividendTerm { Value=TransferDividendTermEnum.FullToTransferor,  DisplayName="Full To Transferor", Description="Full To Transferor"},
               new TransferDividendTerm { Value=TransferDividendTermEnum.FullToTransferee, DisplayName="Full To Transferee", Description="Full To Transferee"},
               new TransferDividendTerm { Value=TransferDividendTermEnum.Shared, DisplayName="Shared", Description="Shared"},
            };

            await ctx.TransferDividendTerms.AddRangeAsync(transferDividendTerms);
        }
    }
}
