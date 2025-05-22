using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.SeedData
{
    public static class ShareholderStatusSeedData
    {
        public static async Task SeedAsync(SMSDbContext ctx)
        {
            if (ctx.ShareholderStatuses.Any()) return;

            var data = new List<ShareholderStatus>() {
               new ShareholderStatus { Value=ShareholderStatusEnum.Active, Name="Active", Description="Active" },
               new ShareholderStatus { Value=ShareholderStatusEnum.Inactive, Name="Inactive", Description="Inactive" },
               new ShareholderStatus { Value=ShareholderStatusEnum.Blocked, Name = "Blocked", Description = "Blocked" },
            };

            await ctx.ShareholderStatuses.AddRangeAsync(data);
        }
    }
}

