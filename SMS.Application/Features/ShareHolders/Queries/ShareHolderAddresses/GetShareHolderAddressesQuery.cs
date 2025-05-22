using MediatR;

namespace SMS.Application;

public class GetShareholderAddressesQuery : IRequest<List<AddressDto>>
{
    public int ShareholderId { get; set; }
}
