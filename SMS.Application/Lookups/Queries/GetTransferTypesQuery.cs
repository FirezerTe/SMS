using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;


namespace SMS.Application.Lookups;

public record GetTransferTypesQuery : IRequest<List<TransferType>>;

public class GetTransferTypesQueryHandler : IRequestHandler<GetTransferTypesQuery, List<TransferType>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetTransferTypesQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }


    public async Task<List<TransferType>> Handle(GetTransferTypesQuery request, CancellationToken cancellationToken)
    {
        return await dataService.TransferTypes.AsNoTracking().ToListAsync();
    }
}
