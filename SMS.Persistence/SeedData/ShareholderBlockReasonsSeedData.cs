using SMS.Domain;

namespace SMS.Persistence.SeedData
{
    internal class ShareholderBlockReasonsSeedData
    {
        public static async Task SeedAsync(SMSDbContext ctx)
        {
            if (ctx.ShareholderBlockReasons.Any()) return;

            var data = new List<ShareholderBlockReason>() {
               new ShareholderBlockReason { Name="Loan Collateral", Description="Loan Collateral" },
               new ShareholderBlockReason { Name="Court Order", Description="Court Order" },
               new ShareholderBlockReason { Name = "Foreign Citizenship", Description = "Foreign Citizenship" },
               new ShareholderBlockReason { Name = "Other", Description = "Other" },
            };

            await ctx.ShareholderBlockReasons.AddRangeAsync(data);
        }
    }
}
