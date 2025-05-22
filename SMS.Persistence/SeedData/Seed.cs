using Microsoft.AspNetCore.Identity;
using SMS.Domain.User;
using SMS.Persistence.SeedData;

namespace SMS.Persistence;

public static class Seed
{

    public static async Task SeedData(SMSDbContext ctx, UserManager<SMSUser> userManager, RoleManager<SMSRole> roleManager)
    {
        await CountrySeedData.SeedAsync(ctx);
        await BranchSeedData.SeedAsync(ctx);
        await DistrictSeedData.SeedAsync(ctx);
        await RolesAndPermisssionsSeedData.SeedAsync(roleManager);

        var headOffice = ctx.Branches.FirstOrDefault(b => b.IsHeadOffice == true);

        await UserSeedData.SeedAsync(userManager, headOffice!);
        await ShareholderTypeSeedData.SeedAsync(ctx);
        await ShareholderStatusSeedData.SeedAsync(ctx);
        await ShareholderBlockReasonsSeedData.SeedAsync(ctx);
        await ShareholderBlockTypesSeedData.SeedAsync(ctx);
        await PaymentTypeSeedData.SeedAsync(ctx);
        await SubscriptionTypeSeedData.SeedAsync(ctx);

        await EmailTemplatesSeedData.SeedAsync(ctx);
        await TransferTypeSeedData.SeedAsync(ctx);
        await TransferDividendTermsSeedData.SeedAsync(ctx);
        await PaymentMethodsSeedData.SeedAsync(ctx);
        await ForeignCurrencyTypeSeedData.SeedAsync(ctx);
        await DividendPeriodSeedData.SeedAsync(ctx);
        await GeneralLedgerSeedData.SeedAsync(ctx);
        await SMSTemplatesSeedData.SeedAsync(ctx);
        await BatchDescriptionSeedData.SeedAsync(ctx);
        await CertificateTypeSeedData.SeedAsync(ctx);
        await ctx.SaveChangesAsync();

    }
}
