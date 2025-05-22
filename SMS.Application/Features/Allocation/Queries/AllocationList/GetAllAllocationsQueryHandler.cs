using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public record Allocations(
    List<AllocationDto> Approved,
    List<AllocationDto> Submitted,
    List<AllocationDto> Rejected,
    List<AllocationDto> Draft);
public record GetAllAllocationsQuery : IRequest<Allocations>;
public class GetAllAllocationsQueryHandler : IRequestHandler<GetAllAllocationsQuery, Allocations>
{
    private readonly IMapper mapper;
    private readonly IDataService dataService;

    public GetAllAllocationsQueryHandler(IMapper mapper, IDataService dataService)
    {
        this.mapper = mapper;
        this.dataService = dataService;
    }

    public async Task<Allocations> Handle(GetAllAllocationsQuery request, CancellationToken cancellationToken)
    {
        var allocations = await dataService.Allocations.TemporalAll()
           .ProjectTo<AllocationDto>(mapper.ConfigurationProvider)
           .ToListAsync();

        var draft = allocations.Where(p => p.ApprovalStatus == ApprovalStatus.Draft && p.PeriodEnd > DateTime.UtcNow).ToList();

        var submitted = allocations
            .Where(p => p.ApprovalStatus == ApprovalStatus.Submitted &&
            p.PeriodEnd > DateTime.UtcNow).ToList();

        var approved = allocations
            .Where(p => p.ApprovalStatus == ApprovalStatus.Approved)
            .OrderByDescending(p => p.PeriodEnd)
            .GroupBy(p => new { p.Id })
            .Select(grp => grp.FirstOrDefault())
            .ToList();



        var rejected = allocations.Where(p => p.ApprovalStatus == ApprovalStatus.Rejected
                                              && (!approved.Any(l => l.Id == p.Id) || !approved.Any(l => l.Id == p.Id && l.PeriodStart > p.PeriodEnd)))
                                  .OrderByDescending(p => p.PeriodEnd)
                                  .GroupBy(p => new { p.Id })
                                  .Select(grp => grp.FirstOrDefault())
                                  .ToList();

        return new Allocations(
            Approved: approved,
            Submitted: submitted,
            Rejected: rejected,
            Draft: draft);

    }
}
