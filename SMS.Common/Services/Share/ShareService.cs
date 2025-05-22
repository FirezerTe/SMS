using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Common;

public class ShareService : IShareService
{
    private readonly IDataService dataService;
    private readonly IParValueService parValueService;

    public ShareService(IDataService dataService, IParValueService parValueService)
    {
        this.dataService = dataService;
        this.parValueService = parValueService;
    }
    public async Task CreateOrUpdateShares()
    {
        var currentBankAllocation = await dataService.Banks.TemporalAll()
                                                           .Where(b => b.ApprovalStatus == Domain.Enums.ApprovalStatus.Approved)
                                                           .OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd"))
                                                           .FirstOrDefaultAsync();

        var currentParValue = await parValueService.GetCurrentParValue();

        if (currentParValue == null || currentBankAllocation == null) return;

        var unsoldShares = await dataService.Shares.Where(s => s.PaymentId == null)
        .ExecuteUpdateAsync(x =>
                x.SetProperty(y => y.ParValue, currentParValue.Amount)
                .SetProperty(x => x.BankAllocationVersionNumber, currentBankAllocation.VersionNumber));

        if (currentBankAllocation != null)
        {
            var totalCurrentShareAmount = await dataService.Shares.SumAsync(s => s.ParValue);
            var addedAmount = currentBankAllocation.Amount - totalCurrentShareAmount;
            if (addedAmount <= 0) return;

            var shares = new List<Share>();
            var count = addedAmount / currentParValue.Amount;
            for (int i = 0; i < addedAmount / currentParValue.Amount; i++)
            {
                shares.Add(new Share
                {
                    ParValue = currentParValue.Amount,
                    BankAllocationVersionNumber = currentBankAllocation.VersionNumber

                });
                if (i % 100000 == 0)
                {
                    dataService.Shares.AddRange(shares);

                    await dataService.SaveAsync(default);
                    shares = new List<Share>();
                }
            }

            dataService.Shares.AddRange(shares);

            await dataService.SaveAsync(default);
        }
    }
}

