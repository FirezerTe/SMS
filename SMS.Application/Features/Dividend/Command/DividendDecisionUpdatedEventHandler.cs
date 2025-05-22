using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Application;

public class DividendDecisionUpdatedEventHandler : INotificationHandler<DividendDecisionUpdated>
{
    private readonly IDataService dataService;

    public DividendDecisionUpdatedEventHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task Handle(DividendDecisionUpdated notification, CancellationToken cancellationToken)
    {
        var dividend = await dataService.Dividends.Include(x => x.Shareholder).FirstOrDefaultAsync(d => d.Id == notification.decision.DividendId);
        if (dividend != null)
            dividend.Shareholder.ApprovalStatus = Domain.Enums.ApprovalStatus.Draft;
    }
}
