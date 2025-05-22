using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public record ParValues(
    List<ParValueDto> Approved,
    List<ParValueDto> Submitted,
    List<ParValueDto> Rejected,
    List<ParValueDto> Draft);

public record GetAllParValuesQuery : IRequest<ParValues?>;

internal class GetAllParValuesQueryHandler : IRequestHandler<GetAllParValuesQuery, ParValues?>
{
    private readonly IMapper mapper;
    private readonly IDataService dataService;

    public GetAllParValuesQueryHandler(IMapper mapper, IDataService dataService)
    {
        this.mapper = mapper;
        this.dataService = dataService;
    }

    public async Task<ParValues?> Handle(GetAllParValuesQuery request, CancellationToken cancellationToken)
    {
        var firstParValue = await dataService.ParValues.OrderBy(x => x.CreatedAt).FirstOrDefaultAsync();

        if (firstParValue == null) return null;

        var parValues = await dataService.ParValues.TemporalAll()
                                                   .Where(x => x.Id == firstParValue.Id)
                                                   .ProjectTo<ParValueDto>(mapper.ConfigurationProvider)
                                                   .ToListAsync();

        var draft = parValues.Where(p => p.ApprovalStatus == ApprovalStatus.Draft && p.PeriodEnd > DateTime.UtcNow).ToList();
        var submitted = parValues.Where(p => p.ApprovalStatus == ApprovalStatus.Submitted && p.PeriodEnd > DateTime.UtcNow).ToList();



        var approved = parValues.Where(p => p.ApprovalStatus == ApprovalStatus.Approved)
                                                .OrderByDescending(p => p.PeriodEnd)
                                                .ToList();

        var latestApproved = approved.FirstOrDefault();

        var lastRejected = parValues
            .Where(p => p.ApprovalStatus == ApprovalStatus.Rejected && (p.PeriodEnd > DateTime.UtcNow || latestApproved != null && p.PeriodStart > latestApproved.PeriodEnd))
            .OrderByDescending(p => p.PeriodEnd)
            .FirstOrDefault();

        var rejected = new List<ParValueDto>();
        if (lastRejected != null)
        {
            rejected.Add(lastRejected);
        }
        return new ParValues(
            Approved: approved,
            Submitted: submitted,
            Rejected: rejected,
            Draft: draft);
    }
}
