using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application.Lookups;

public record ForeignCurrencyDto(int Id, string Name, string Description, int DisplayOrder);

public record GetForeignCurrencyTypesQuery : IRequest<List<ForeignCurrencyDto>>;

public class GetForeignCurrencyTypesQueryHandler : IRequestHandler<GetForeignCurrencyTypesQuery, List<ForeignCurrencyDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetForeignCurrencyTypesQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }


    public async Task<List<ForeignCurrencyDto>> Handle(GetForeignCurrencyTypesQuery request, CancellationToken cancellationToken)
    {
        return await dataService.ForeignCurrencyTypes.Where(c => c.Name != "ETB").OrderBy(c => c.DisplayOrder).ThenBy(c => c.Description).ProjectTo<ForeignCurrencyDto>(mapper.ConfigurationProvider).ToListAsync();
    }
}
