using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetOutstandingShareAllocationReportDataQuery : IRequest<OutstandingShareAllocationReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

    public class GetOutstandingShareAllocationReportDataQueryHandler : IRequestHandler<GetOutstandingShareAllocationReportDataQuery, OutstandingShareAllocationReportDto>
    {
        private readonly IDataService dataService;

        public GetOutstandingShareAllocationReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<OutstandingShareAllocationReportDto> Handle(GetOutstandingShareAllocationReportDataQuery request, CancellationToken cancellationToken)
        {
            var searchAllocationSummary = await dataService.AllocationSubscriptionSummaries
             .Where(a => DateOnly.FromDateTime(a.CreatedAt.Value.Date) >= request.FromDate && DateOnly.FromDateTime(a.CreatedAt.Value.Date) <= request.ToDate)
             .ToListAsync();
            var searchAllocations = await dataService.Allocations
             .Where(a => DateOnly.FromDateTime(a.CreatedAt.Value.Date) >= request.FromDate && DateOnly.FromDateTime(a.CreatedAt.Value.Date) <= request.ToDate)
             .ToListAsync();

            var TotalRemaining = (searchAllocations.Sum(a => a.Amount)) - (searchAllocationSummary.Sum(a => a.TotalApprovedSubscriptions));
            return new OutstandingShareAllocationReportDto
            {
                FromDate = request.FromDate,
                ToDate = request.ToDate,
                OutstandingAllocations = await GetOutstandingAllocationAsync(request),
                TotalAmount = TotalRemaining,
            };
        }
        private async Task<List<OutstandingAllocationsDto>> GetOutstandingAllocationAsync(GetOutstandingShareAllocationReportDataQuery request)
        {
            var Allocate = new List<OutstandingAllocationsDto>();
            var searchAllocations = await dataService.Allocations
              .Where(a => DateOnly.FromDateTime(a.CreatedAt.Value.Date) >= request.FromDate && DateOnly.FromDateTime(a.CreatedAt.Value.Date) <= request.ToDate)
              .ToListAsync();
            var allocationSummaryList = await dataService.AllocationSubscriptionSummaries.ToListAsync();
            var TotalRemaining = searchAllocations.Sum(a => a.AllocationRemaining);
            for (int i = 0; i < searchAllocations.Count; i++)
            {
                var sequence = i + 1;
                var searchAllocationSummary = allocationSummaryList
               .Where(a => a.AllocationId == searchAllocations[i].Id).FirstOrDefault();

                var allocation = new OutstandingAllocationsDto
                {
                    Sequence = sequence,
                    TotalAmount = TotalRemaining,
                    Amount = searchAllocations[i].Amount,
                    AllocationName = searchAllocations[i].Name,
                    AllocationTotalPaidUp = searchAllocationSummary.TotalApprovedSubscriptions,
                    AllocationRemaining = (searchAllocations[i].Amount) - (searchAllocationSummary.TotalApprovedSubscriptions),
                    CreatedAt = (searchAllocations[i].CreatedAt.Value.Date).ToString("dd MMMM yyyy"),
                    FromDate = searchAllocations[i].FromDate,
                    ToDate = searchAllocations[i].ToDate,
                };
                Allocate.Add(allocation);
            }
            return Allocate;
        }
    }
}