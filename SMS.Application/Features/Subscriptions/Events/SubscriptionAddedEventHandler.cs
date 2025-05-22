using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public class SubscriptionAddedEventHandler : INotificationHandler<SubscriptionAddedEvent>
{
    private readonly IDataService dataService;

    public SubscriptionAddedEventHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(SubscriptionAddedEvent notification, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == notification.Subscription.ShareholderId);
        if (shareholder != null)
            shareholder.ApprovalStatus = ApprovalStatus.Draft;
    }
}
