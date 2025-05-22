using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application.Lookups.Queries;

public record GetDistrictQuery : IRequest<List<DistrictDto>>;

internal class GetDistrictQueryHandler : IRequestHandler<GetDistrictQuery, List<DistrictDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetDistrictQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }

    public async Task<List<DistrictDto>> Handle(GetDistrictQuery request, CancellationToken cancellationToken)
    {
        var districts = await dataService.Districts.ToListAsync();
        return mapper.Map<List<DistrictDto>>(districts);
    }

}