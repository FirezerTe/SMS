using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public class PaymentAddedEventHandler : INotificationHandler<PaymentAddedEvent>
{
    private readonly IDataService dataService;

    public PaymentAddedEventHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(PaymentAddedEvent notification, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Subscriptions.Where(p => p.Id == notification.Payment.SubscriptionId)
                                                       .Select(s => s.Shareholder)
                                                       .FirstOrDefaultAsync();

        if (shareholder != null)
            shareholder.ApprovalStatus = ApprovalStatus.Draft;
    }
}
