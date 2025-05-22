using SMS.Domain.GL;

namespace SMS.Persistence.SeedData
{
    public static class GeneralLedgerSeedData
    {
        public static async Task SeedAsync(SMSDbContext dbContext)
        {
            if (!dbContext.GeneralLedgers.Any())
            {
                await dbContext.GeneralLedgers.AddRangeAsync(GeneralLedgers);
            }
        }
        private static List<GeneralLedger> GeneralLedgers => new List<GeneralLedger>()
        {
             new GeneralLedger () {GLNumber ="14-01-999-300-3000001",Value=Domain.Enums.GeneralLedgerTypeEnum.PaidUpCapital,Description="PaidupCapital",AccountType="GL",TransactionType="CR"},
             new GeneralLedger () {GLNumber="14-01-999-300-3000006",Value=Domain.Enums.GeneralLedgerTypeEnum.PremiumPayment,Description="PremiumAmount",AccountType="GL",TransactionType="CR"},
             new GeneralLedger () {GLNumber="14-01-999-201-2010001",Value=Domain.Enums.GeneralLedgerTypeEnum.CapitalGainTax,Description="CapitalGainTax",AccountType="GL",TransactionType="CR"},
             new GeneralLedger () {GLNumber="14-01-091-214-2140019",Value=Domain.Enums.GeneralLedgerTypeEnum.NewShareGl,Description="NewShareGl",AccountType="GL",TransactionType="DR"},
             new GeneralLedger () {GLNumber="14-01-999-214-2140018",Value=Domain.Enums.GeneralLedgerTypeEnum.ShareProcessingSuspense,Description="ShareProcessingSuspense",AccountType="GL",TransactionType="DR"},
             new GeneralLedger () {GLNumber="14-01-001-214-2140009",Value=Domain.Enums.GeneralLedgerTypeEnum.DividendPayableGl,Description="DividendPayableAccount",AccountType="GL",TransactionType="CR"},
             new GeneralLedger () {GLNumber="14-01-001-201-2010011",Value=Domain.Enums.GeneralLedgerTypeEnum.DividendTaxGl,Description="DividendTaxpayable",AccountType="GL",TransactionType="CR"},
             new GeneralLedger () {GLNumber="14-01-001-214-2140016",Value=Domain.Enums.GeneralLedgerTypeEnum.UncollectedDividendGl ,Description="UncollectedDividendPay ",AccountType="GL",TransactionType="CR" }
       };
    }
}
