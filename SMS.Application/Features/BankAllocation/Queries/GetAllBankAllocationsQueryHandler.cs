using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public record BankAllocations(
    List<BankAllocationDto> Approved,
    List<BankAllocationDto> Submitted,
    List<BankAllocationDto> Rejected,
    List<BankAllocationDto> Draft);

public record GetAllBankAllocationsQuery() : IRequest<BankAllocations?>;

public class GetAllBankAllocationsQueryHandler : IRequestHandler<GetAllBankAllocationsQuery, BankAllocations?>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;


    public GetAllBankAllocationsQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<BankAllocations?> Handle(GetAllBankAllocationsQuery request, CancellationToken cancellationToken)
    {
        var firstBankAllocation = await dataService.Banks.OrderBy(x => x.CreatedAt).FirstOrDefaultAsync();

        if (firstBankAllocation == null) return null;

        var bankAllocations = await dataService.Banks.TemporalAll()
                                                  .Where(x => x.Id == firstBankAllocation.Id)
                                                  .ProjectTo<BankAllocationDto>(mapper.ConfigurationProvider)
                                                  .ToListAsync();

        var draft = bankAllocations.Where(p => p.ApprovalStatus == ApprovalStatus.Draft && p.PeriodEnd > DateTime.UtcNow).ToList();
        var submitted = bankAllocations.Where(p => p.ApprovalStatus == ApprovalStatus.Submitted && p.PeriodEnd > DateTime.UtcNow).ToList();



        var approved = bankAllocations.Where(p => p.ApprovalStatus == ApprovalStatus.Approved)
                                                .OrderByDescending(p => p.PeriodEnd)
                                                .ToList();

        var latestApproved = approved.FirstOrDefault();

        var lastRejected = bankAllocations
            .Where(p => p.ApprovalStatus == ApprovalStatus.Rejected && (p.PeriodEnd > DateTime.UtcNow || latestApproved != null && p.PeriodStart > latestApproved.PeriodEnd))
            .OrderByDescending(p => p.PeriodEnd)
            .FirstOrDefault();

        var rejected = new List<BankAllocationDto>();
        if (lastRejected != null)
        {
            rejected.Add(lastRejected);
        }
        return new BankAllocations(
            Approved: approved,
            Submitted: submitted,
            Rejected: rejected,
            Draft: draft);
    }
}
