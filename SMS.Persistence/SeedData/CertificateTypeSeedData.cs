using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.SeedData
{
    public static class CertificateTypeSeedData
    {
        public static async Task SeedAsync(SMSDbContext ctx)
        {
            if (ctx.CertficateTypes.Any()) return;

            var certficateTypes = new List<CertficateType>() {
               new CertficateType { Value= CertificateIssuanceTypeEnum.Replacement, Name="Replacement", Description="Replacement when lost or damaged"},
               new CertficateType { Value= CertificateIssuanceTypeEnum.Amalgamation, Name="Amalgamation", Description="Amalgamation of two or more shares into one"},
               new CertficateType { Value= CertificateIssuanceTypeEnum.Incremental, Name="Incremental", Description="Incremental"},
            };

            await ctx.CertficateTypes.AddRangeAsync(certficateTypes);
        }
    }
}