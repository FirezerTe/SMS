using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;



namespace SMS.Application;

public class GetShareholderDetailQueryHandler : IRequestHandler<GetShareholderDetailQuery, ShareholderDetailsDto>
{
    private readonly IMapper mapper;
    private readonly IDataService dataservice;

    public GetShareholderDetailQueryHandler(IMapper mapper, IDataService dataservice)
    {
        this.mapper = mapper;
        this.dataservice = dataservice;
    }


    public async Task<ShareholderDetailsDto> Handle(GetShareholderDetailQuery request, CancellationToken cancellationToken)
    {
        var shareholder = await dataservice
            .Shareholders
            //.Include(sh => sh.Addresses)
            //.Include(sh => sh.Contacts)
            .Include(s => s.Type)
            .Include(s => s.Families)
            .ThenInclude(f => f.Members)
            .ThenInclude(m => m.ShareholderDocuments)
            .Include(s => s.ShareholderDocuments)
            .AsSplitQuery()
            .FirstOrDefaultAsync(sh => sh.Id == request.Id);

        return mapper.Map<ShareholderDetailsDto>(shareholder);
    }
}
