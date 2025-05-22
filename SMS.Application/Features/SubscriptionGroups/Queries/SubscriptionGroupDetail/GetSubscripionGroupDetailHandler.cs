using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application
{
    public record GetSubscriptionGroupDetailQuery(int Id) : IRequest<SubscriptionGroupInfo?>;

    public class GetSubscriptionGroupDetailHandler : IRequestHandler<GetSubscriptionGroupDetailQuery, SubscriptionGroupInfo?>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;

        public GetSubscriptionGroupDetailHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }


        public async Task<SubscriptionGroupInfo?> Handle(GetSubscriptionGroupDetailQuery request, CancellationToken cancellationToken)
        {
            var subscriptionGroup = await dataService.SubscriptionGroups
              .ProjectTo<SubscriptionGroupInfo>(mapper.ConfigurationProvider)
              .FirstOrDefaultAsync(x => x.Id == request.Id);

            return subscriptionGroup;
        }
    }
}
