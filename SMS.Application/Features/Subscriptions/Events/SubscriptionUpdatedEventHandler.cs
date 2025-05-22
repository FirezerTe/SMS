using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public class SubscriptionUpdatedEventHandler : INotificationHandler<SubscriptionUpdatedEvent>
{
    private readonly IDataService dataService;

    public SubscriptionUpdatedEventHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(SubscriptionUpdatedEvent notification, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == notification.Subscription.ShareholderId);
        if (shareholder != null)
            shareholder.ApprovalStatus = ApprovalStatus.Draft;
    }
}
