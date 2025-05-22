using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

using SMS.Application.Models;

namespace SMS.Application.Features.User.Queries
{
    public class GetAllRolesQuery : IRequest<List<ApplicationRole>>
    {
    }

    public class GetAllRolesQueryHandler : IRequestHandler<GetAllRolesQuery, List<ApplicationRole>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetAllRolesQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<ApplicationRole>> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
        {
            var roles = await dataService.Roles.ToListAsync();
            return mapper.Map<List<ApplicationRole>>(roles);
        }
    }
}
