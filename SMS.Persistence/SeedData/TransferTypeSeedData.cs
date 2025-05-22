using SMS.Domain;

namespace SMS.Persistence.SeedData;

public static class TransferTypeSeedData
{
    public static async Task SeedAsync(SMSDbContext ctx)
    {
        if (ctx.TransferTypes.Any()) return;

        var transferTypes = new List<TransferType>() {
           new() {Value=TransferTypeEnum.Inheritance, DisplayName="Inheritance", Description="Inheritance"},
           new() {Value=TransferTypeEnum.Gift, DisplayName="Gift", Description="Gift"},
           new() {Value=TransferTypeEnum.Split, DisplayName="Split", Description="Split"},
           new() {Value=TransferTypeEnum.Sale, DisplayName="Sale", Description="Sale"},
           new() {Value=TransferTypeEnum.CourtOrder, DisplayName="Court Order", Description="Court Order"}
        };

        await ctx.TransferTypes.AddRangeAsync(transferTypes);
    }
}
