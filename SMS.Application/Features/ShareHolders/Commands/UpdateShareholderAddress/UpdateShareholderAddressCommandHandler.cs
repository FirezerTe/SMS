using MediatR;
using SMS.Application.Exceptions;
using SMS.Application.Security;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record UpdateShareholderAddressCommand(int ShareholderId, AddressDto Address) : IRequest<int>;

public class UpdateShareholderAddressCommandHandler : IRequestHandler<UpdateShareholderAddressCommand, int>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public UpdateShareholderAddressCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public async Task<int> Handle(UpdateShareholderAddressCommand request, CancellationToken cancellationToken)
    {
        var address = dataService.Addresses.FirstOrDefault(x => x.Id == request.Address.Id && x.ShareholderId == request.ShareholderId);
        if (address == null)
        {
            throw new NotFoundException($"Unable to find Address", request.Address);
        }


        address.CountryId = request.Address.CountryId;
        address.City = request.Address.City;
        address.SubCity = request.Address.SubCity;
        address.Kebele = request.Address.Kebele;
        address.Woreda = request.Address.Woreda;
        address.HouseNumber = request.Address.HouseNumber;

        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogAddressChange(address, Domain.ChangeType.Modified, cancellationToken);

        return address.Id;
    }
}
