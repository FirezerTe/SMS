using SMS.Domain;

namespace SMS.Persistence.SeedData
{
    public static class ShareholderTypeSeedData
    {
        public static async Task SeedAsync(SMSDbContext ctx)
        {
            if (ctx.ShareholderTypes.Any()) return;

            var shareholderTypes = new List<ShareholderType>() {
               new ShareholderType {
                   Value=Domain.Enums.ShareholderTypeEnum.Individual,
                   Description="Individual",
                   DisplayName="Individual"
               },
               
               new ShareholderType {
                   Value=Domain.Enums.ShareholderTypeEnum.Organization,
                   Description="Organization",
                   DisplayName="Organization"
               },
               new ShareholderType {
                   Value=Domain.Enums.ShareholderTypeEnum.Association,
                   Description="Association",
                   DisplayName="Association"
                },
               new ShareholderType {
                   Value=Domain.Enums.ShareholderTypeEnum.Church,
                   Description="Church",
                   DisplayName="Church"
               },
               new ShareholderType {
                   Value=Domain.Enums.ShareholderTypeEnum.Edir,
                   Description="Edir (እድር)",
                   DisplayName="Edir (እድር)"
               },
            };

            await ctx.ShareholderTypes.AddRangeAsync(shareholderTypes);
        }
    }
}

