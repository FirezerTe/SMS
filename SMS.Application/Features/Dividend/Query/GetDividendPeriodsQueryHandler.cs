using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record GetDividendPeriodsQuery() : IRequest<List<DividendPeriodDto>>;

public class GetDividendPeriodsQueryHandler : IRequestHandler<GetDividendPeriodsQuery, List<DividendPeriodDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetDividendPeriodsQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<List<DividendPeriodDto>> Handle(GetDividendPeriodsQuery request, CancellationToken cancellationToken)
    {
        return await dataService.DividendPeriods.OrderBy(d => d.StartDate).ProjectTo<DividendPeriodDto>(mapper.ConfigurationProvider).ToListAsync();
    }
}
