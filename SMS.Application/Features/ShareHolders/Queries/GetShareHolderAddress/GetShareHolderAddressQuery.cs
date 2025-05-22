using MediatR;

namespace SMS.Application.Features.ShareHolders
{
    public class GetShareHolderAddressQuery: IRequest<List<GetShareHolderAddressDTO>>
    {
        public int ShareHolderID { get; set; }
    }
}
