using MediatR;
using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record UpdateShareholderContactCommand(int ShareholderId, ContactDto Contact) : IRequest<int>;

public class UpdateShareholderContactCommandHandler : IRequestHandler<UpdateShareholderContactCommand, int>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public UpdateShareholderContactCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }
    public async Task<int> Handle(UpdateShareholderContactCommand request, CancellationToken cancellationToken)
    {
        var shareholder = dataService.Shareholders.FirstOrDefault(x => x.Id == request.ShareholderId);
        if (shareholder == null)
        {
            throw new NotFoundException($"Unable to find Shareholder with Id", request.ShareholderId);
        }

        var contact = dataService.Contacts.FirstOrDefault(x => x.ShareholderId == request.ShareholderId && x.Id == request.Contact.Id);

        if (contact == null)
        {
            throw new NotFoundException($"Unable to find contact with shareholderId: {request.ShareholderId} && contactId: {request.Contact.Id}", request.Contact);
        }

        contact.Type = request.Contact.Type;
        contact.Value = request.Contact.Value;

        contact.AddDomainEvent(new ContactUpdatedEvent(contact));

        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogContactChange(contact, ChangeType.Modified, cancellationToken);

        return contact.Id;
    }
}
