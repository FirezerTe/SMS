using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public class TransferAddedEventHandler : INotificationHandler<TransferAddedEvent>
{
    private readonly IDataService dataService;

    public TransferAddedEventHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(TransferAddedEvent notification, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == notification.Transfer.FromShareholderId);
        if (shareholder != null)
            shareholder.ApprovalStatus = ApprovalStatus.Draft;
    }
}
