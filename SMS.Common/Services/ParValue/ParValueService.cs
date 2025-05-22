using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Common;

public class ParValueService : IParValueService
{
    private readonly IDataService dataService;

    public ParValueService(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task<ParValue?> GetCurrentParValue()
    {
        var firstParValue = await dataService.ParValues.OrderBy(x => x.CreatedAt).FirstOrDefaultAsync();
        if (firstParValue == null) return null;

        return await dataService.ParValues.TemporalAll()
                                          .Where(x => x.Id == firstParValue.Id && x.ApprovalStatus == ApprovalStatus.Approved)
                                          .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                                          .FirstOrDefaultAsync();
    }
}
