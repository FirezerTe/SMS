using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application.Lookups
{
    public record GetCountriesQuery : IRequest<List<CountryDto>>;

    internal class GetCountriesQueryHandler : IRequestHandler<GetCountriesQuery, List<CountryDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetCountriesQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<List<CountryDto>> Handle(GetCountriesQuery request, CancellationToken cancellationToken)
        {
            var countries = await dataService.Countries.OrderBy(c => c.DisplayOrder).ThenBy(c => c.Name).ProjectTo<CountryDto>(mapper.ConfigurationProvider).AsNoTracking().ToListAsync();

            return countries;
        }

    }
}
