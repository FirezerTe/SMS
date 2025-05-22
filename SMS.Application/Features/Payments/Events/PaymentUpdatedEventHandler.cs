using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public class PaymentUpdatedEventHandler : INotificationHandler<PaymentUpdatedEvent>
{
    private readonly IDataService dataService;

    public PaymentUpdatedEventHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(PaymentUpdatedEvent notification, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Payments.Where(p => p.Id == notification.Payment.Id)
                                                       .Select(p => p.Subscription.Shareholder)
                                                       .FirstOrDefaultAsync();



        if (shareholder != null)
        {
            shareholder.ApprovalStatus = ApprovalStatus.Draft;

        }

    }
}
