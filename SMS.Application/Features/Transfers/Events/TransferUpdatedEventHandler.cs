using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public class TransferUpdatedEventHandler : INotificationHandler<TransferUpdatedEvent>
{
    private readonly IDataService dataService;

    public TransferUpdatedEventHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(TransferUpdatedEvent notification, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == notification.Transfer.FromShareholderId);
        if (shareholder != null)
            shareholder.ApprovalStatus = ApprovalStatus.Draft;
    }
}
