

using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SMS.Domain;
using SMS.Domain.Enums;

public class ContactCreatedEventHandler : INotificationHandler<ContactCreatedEvent>
{
    private readonly ILogger<ContactCreatedEventHandler> logger;
    private readonly IDataService dataService;

    public ContactCreatedEventHandler(ILogger<ContactCreatedEventHandler> logger, IDataService dataService)
    {
        this.logger = logger;
        this.dataService = dataService;
    }
    public async Task Handle(ContactCreatedEvent notification, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == notification.Contact.ShareholderId);
        if (shareholder != null)
            shareholder.ApprovalStatus = ApprovalStatus.Draft;
    }
}