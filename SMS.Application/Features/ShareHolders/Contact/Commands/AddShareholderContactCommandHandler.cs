using MediatR;

using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record AddShareholderContactCommand(int ShareholderId, ContactDto Contact) : IRequest<int>;


internal class AddShareholderContactCommandHandler : IRequestHandler<AddShareholderContactCommand, int>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public AddShareholderContactCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }
    public async Task<int> Handle(AddShareholderContactCommand request, CancellationToken cancellationToken)
    {
        var shareholder = dataService.Shareholders.FirstOrDefault(x => x.Id == request.ShareholderId);
        if (shareholder == null)
        {
            throw new NotFoundException($"Unable to find Shareholder with Id", request.ShareholderId);
        }

        var contact = new Contact
        {
            ShareholderId = request.ShareholderId,
            Type = request.Contact.Type,
            Value = request.Contact.Value,
        };

        dataService.Contacts.Add(contact);
        contact.AddDomainEvent(new ContactCreatedEvent(contact));
        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogContactChange(contact, ChangeType.Added, cancellationToken);

        return contact.Id;
    }
}
