using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

using SMS.Domain;

namespace SMS.Application.Lookups.Queries
{
    public record GetBranchQuery : IRequest<List<BranchDto>>;
    internal class GetBranchQueriesHandler : IRequestHandler<GetBranchQuery, List<BranchDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetBranchQueriesHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<List<BranchDto>> Handle(GetBranchQuery request, CancellationToken cancellationToken)
        {
            var allocations = await dataService.Branches.ToListAsync();
            //var et = allocations.FirstOrDefault(c => c.AllocationID == 100);
            //var usa = countries.FirstOrDefault(c => c.Code == "USA");

            // var others = allocations.Where(c => c.Id != 100).OrderBy(c => c.AllocationID).ToList();
            var orderedCountries = new List<Branch>();
            orderedCountries.AddRange(allocations);

            return mapper.Map<List<BranchDto>>(orderedCountries);
        }
    }
}
