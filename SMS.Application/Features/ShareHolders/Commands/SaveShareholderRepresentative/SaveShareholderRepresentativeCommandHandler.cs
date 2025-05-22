using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;


[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record SaveShareholderRepresentativeCommand(int ShareholderId, string Name, string Email, string PhoneNumber, RepresentativeAddress address) : IRequest;

internal class SaveShareholderRepresentativeCommandHandler : IRequestHandler<SaveShareholderRepresentativeCommand>
{
    private readonly IDataService dataService;

    public SaveShareholderRepresentativeCommandHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(SaveShareholderRepresentativeCommand request, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == request.ShareholderId);
        if (shareholder == null)
        {
            throw new NotFoundException($"Unable to find Shareholder with Id", request.ShareholderId);
        }

        shareholder.RepresentativeName = request.Name;
        shareholder.RepresentativeEmail = request.Email;
        shareholder.RepresentativePhoneNumber = request.PhoneNumber;
        shareholder.RepresentativeAddress = request.address;
        await dataService.SaveAsync(cancellationToken);
    }
}
