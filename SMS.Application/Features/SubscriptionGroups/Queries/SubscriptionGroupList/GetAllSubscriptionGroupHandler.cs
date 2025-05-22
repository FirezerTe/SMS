using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application
{
    public record GetAllSubscriptionGroupQuery() : IRequest<List<SubscriptionGroupInfo>>;

    public class GetAllSubscriptionGroupsHandler : IRequestHandler<GetAllSubscriptionGroupQuery, List<SubscriptionGroupInfo>>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;

        public GetAllSubscriptionGroupsHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }

        public async Task<List<SubscriptionGroupInfo>> Handle(GetAllSubscriptionGroupQuery request, CancellationToken cancellationToken)
        {
            var subscriptionGroups = await dataService.SubscriptionGroups
                .ProjectTo<SubscriptionGroupInfo>(mapper.ConfigurationProvider)
                .ToListAsync();

            return subscriptionGroups.OrderBy(x => x.IsDividendCapitalization).ToList();
        }
    }
}
