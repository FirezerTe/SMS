using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetAllShareholderAllocatedSubscriptionReportDataQuery : IRequest<AllShareholdersAllocatedSubscriptionReportDto>
    {
        public int ShareholderId { get; set; }
    }

    public class GetAllShareholderAllocatedSubscriptionReportDataQueryHandler : IRequestHandler<GetAllShareholderAllocatedSubscriptionReportDataQuery, AllShareholdersAllocatedSubscriptionReportDto>
    {
        private readonly IDataService dataService;

        public GetAllShareholderAllocatedSubscriptionReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<AllShareholdersAllocatedSubscriptionReportDto> Handle(GetAllShareholderAllocatedSubscriptionReportDataQuery request, CancellationToken cancellationToken)
        {
            return new AllShareholdersAllocatedSubscriptionReportDto
            {

                ShareholderId = request.ShareholderId,
                AllShareholdersAllocatedSubscription = await GetAllShareholdersAllocationsAsync(request),
            };
        }
        private async Task<List<AllShareholdersAllocatedSubscriptionDto>> GetAllShareholdersAllocationsAsync(GetAllShareholderAllocatedSubscriptionReportDataQuery request)
        {
            var allocatedSubscription = new List<AllShareholdersAllocatedSubscriptionDto>();
            var shareholderAllocatedSubscription = new List<Domain.ShareholderAllocation>();
            var shareholderAllocatedList = await dataService.ShareholderAllocations.ToListAsync();
            var allocationList = await dataService.Allocations.ToListAsync();
            var shareholderList = await dataService.Shareholders.ToListAsync();
            shareholderAllocatedSubscription = shareholderAllocatedList.Where(a => (request.ShareholderId == 0 || request.ShareholderId == a.ShareholderId)).ToList();
            for (int i = 0; i < shareholderAllocatedSubscription.Count; i++)
            {
                var searchShareholder = shareholderList.Where(a => a.Id == shareholderAllocatedSubscription[i].ShareholderId).FirstOrDefault();
                var searchAllocation = allocationList.Where(a => a.Id == shareholderAllocatedSubscription[i].AllocationId).FirstOrDefault();
                var allocation = new AllShareholdersAllocatedSubscriptionDto
                {
                    ShareholderName = searchShareholder.DisplayName,
                    ShareholderID = shareholderAllocatedSubscription[i].ShareholderId,
                    AllocationID = shareholderAllocatedSubscription[i].AllocationId,
                    SubscriptionAllocationAmount = shareholderAllocatedSubscription[i].MaxPurchaseLimit,
                    ExpireDate = shareholderAllocatedSubscription[i].CreatedAt,

                };
                allocatedSubscription.Add(allocation);
            }



            return allocatedSubscription;
        }
    }
}