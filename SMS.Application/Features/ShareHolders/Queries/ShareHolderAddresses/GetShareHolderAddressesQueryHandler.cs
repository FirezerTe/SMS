using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace SMS.Application;

public class GetShareholderAddressesQueryHandler :
    IRequestHandler<GetShareholderAddressesQuery, List<AddressDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;
    private readonly IPaymentService paymentService;

    public GetShareholderAddressesQueryHandler(IDataService dataService, IMapper mapper, IPaymentService paymentService)
    {
        this.dataService = dataService;
        this.mapper = mapper;
        this.paymentService = paymentService;
    }
    public async Task<List<AddressDto>> Handle(GetShareholderAddressesQuery request, CancellationToken cancellationToken)
    {
        var shareholderAddresses = await dataService.Addresses
             .Include(a => a.Shareholder)
             .Where(a => a.ShareholderId == request.ShareholderId)
             .ToListAsync();

        var result = mapper.Map<List<AddressDto>>(shareholderAddresses);

        return result;
    }
}
