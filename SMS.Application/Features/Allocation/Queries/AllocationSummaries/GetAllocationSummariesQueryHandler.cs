using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public record AllocationSummary(Allocation Allocation, List<AllocationSubscriptionSummary> Summaries);

public record AllocationSummaries(List<AllocationSummary> summary);

public record GetAllocationSummariesQuery() : IRequest<List<AllocationSubscriptionSummaryDto>>;

internal class GetAllocationSummariesQueryHandler : IRequestHandler<GetAllocationSummariesQuery, List<AllocationSubscriptionSummaryDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetAllocationSummariesQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }

    public async Task<List<AllocationSubscriptionSummaryDto>> Handle(GetAllocationSummariesQuery request, CancellationToken cancellationToken)
    {

        var summaries = await dataService.AllocationSubscriptionSummaries
            .ProjectTo<AllocationSubscriptionSummaryDto>(mapper.ConfigurationProvider)
            .ToListAsync();

        var approvedAllocations = await dataService.Allocations.TemporalAll()
            .Where(p => p.ApprovalStatus == ApprovalStatus.Approved)
            .GroupBy(p => new { p.Id })
            .Select(grp => grp.OrderByDescending(p => EF.Property<DateTime>(p, "PeriodEnd")).FirstOrDefault())
            .ToListAsync();

        foreach (var summary in summaries)
        {
            var allocation = approvedAllocations.FirstOrDefault(a => a.Id == summary.AllocationId);
            summary.TotalAllocation = allocation?.Amount ?? 0;
            summary.AllocationName = allocation?.Name;
            summary.AllocationDescription = allocation?.Description;
            summary.IsOnlyForExistingShareholders = allocation?.IsOnlyForExistingShareholders;
            summary.IsDividendAllocation = allocation?.IsDividendAllocation;
        }

        return summaries;
    }
}
