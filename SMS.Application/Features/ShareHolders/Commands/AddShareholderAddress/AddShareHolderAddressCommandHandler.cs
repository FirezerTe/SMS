using MediatR;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record AddShareHolderAddressCommand(int ShareholderId, AddressDto Address) : IRequest<int>;

public class AddShareHolderAddressCommandHandler : IRequestHandler<AddShareHolderAddressCommand, int>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public AddShareHolderAddressCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public async Task<int> Handle(AddShareHolderAddressCommand request, CancellationToken cancellationToken)
    {
        var address = new Address()
        {
            ShareholderId = request.ShareholderId,
            CountryId = request.Address.CountryId,
            City = request.Address.City,
            SubCity = request.Address.SubCity,
            Kebele = request.Address.Kebele,
            Woreda = request.Address.Woreda,
            HouseNumber = request.Address.HouseNumber,
        };

        dataService.Addresses.Add(address);

        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogAddressChange(address, ChangeType.Added, cancellationToken);

        return address.Id;
    }
}
