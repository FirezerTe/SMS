using SMS.Domain;

namespace SMS.Persistence.SeedData
{
    internal class ShareholderBlockTypesSeedData
    {
        public static async Task SeedAsync(SMSDbContext ctx)
        {
            if (ctx.ShareholderBlockTypes.Any()) return;

            var data = new List<ShareholderBlockType>() {
               new ShareholderBlockType { Name="PaidUp Capital", Description="PaidUp Capital" },
               new ShareholderBlockType { Name="PaidUp and Dividend", Description="PaidUp and Dividend" },
               new ShareholderBlockType { Name = "Foreigner", Description = "Foreigner" },
               new ShareholderBlockType { Name = "Other", Description = "Other" },
            };

            await ctx.ShareholderBlockTypes.AddRangeAsync(data);
        }
    }
}
