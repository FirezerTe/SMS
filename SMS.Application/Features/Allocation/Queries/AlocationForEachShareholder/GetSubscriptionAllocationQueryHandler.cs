using AutoMapper;
using MediatR;


namespace SMS.Application.Features.Allocation.Queries.AlocationForEachShareholder
{
    public class GetSubscriptionAllocationQueryHandler : IRequestHandler<GetSubscriptionAllocationQuery, GetSubscriptionAllocationQuery>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataservice;

        public GetSubscriptionAllocationQueryHandler(IMapper mapper, IDataService dataservice)
        {
            this.mapper = mapper;
            this.dataservice = dataservice;
        }


        public async Task<GetSubscriptionAllocationQuery> Handle(GetSubscriptionAllocationQuery request, CancellationToken cancellationToken)
        {
            var subscriptionAllocation = dataservice.SubscriptionAllocations
              .Where(a => a.ShareholderId == request.ShareholderId)
              .OrderBy(a => a.Id)
              .LastOrDefault();

            return mapper.Map<GetSubscriptionAllocationQuery>(subscriptionAllocation);

        }

    }
}
