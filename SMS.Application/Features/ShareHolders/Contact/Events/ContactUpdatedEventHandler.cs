

using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

public class ContactUpdatedEventHandler : INotificationHandler<ContactUpdatedEvent>
{
    private readonly IDataService dataService;

    public ContactUpdatedEventHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(ContactUpdatedEvent notification, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == notification.Contact.ShareholderId);
        if (shareholder != null)
            shareholder.ApprovalStatus = ApprovalStatus.Draft;
    }
}