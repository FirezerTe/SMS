using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace SMS.Application.Features.ShareHolders
{
    public class GetShareHolderAddressQueryHandler :
        IRequestHandler<GetShareHolderAddressQuery, List<GetShareHolderAddressDTO>>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;

        public GetShareHolderAddressQueryHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }

        public async Task<List<GetShareHolderAddressDTO>> Handle(GetShareHolderAddressQuery request, CancellationToken cancellationToken)
        {
            var addresses = await dataService.Addresses
                .Include(a => a.Shareholder)
                .Where(sh => sh.ShareholderId == request.ShareHolderID).ToListAsync();
            var result = mapper.Map<List<GetShareHolderAddressDTO>>(addresses);


            return result;

        }
    }
}
