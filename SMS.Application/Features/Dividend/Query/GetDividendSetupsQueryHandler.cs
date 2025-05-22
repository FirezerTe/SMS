using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public record GetDividendSetupsQuery() : IRequest<List<DividendSetupDto>>;

public class GetDividendSetupsQueryHandler : IRequestHandler<GetDividendSetupsQuery, List<DividendSetupDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetDividendSetupsQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<List<DividendSetupDto>> Handle(GetDividendSetupsQuery request, CancellationToken cancellationToken)
    {
        var setupDecisions = await dataService.Dividends
                                                .GroupBy(x => x.DividendSetupId)
                                                .Select(grp => new
                                                {
                                                    setupId = grp.Key,
                                                    hasPendingDecision = grp.Any(d => d.DividendDecision != null && d.DividendDecision.Decision == DividendDecisionType.Pending),
                                                    taxApplied = grp.Any(d => d.DividendDecision != null && d.DividendDecision.TaxApplied)
                                                })
                                                .AsNoTracking()
                                                .ToListAsync();

        var setups = await dataService.DividendSetups.ProjectTo<DividendSetupDto>(mapper.ConfigurationProvider).ToListAsync();

        foreach (var setup in setups)
        {
            if (setupDecisions.Any(d => d.setupId == setup.Id && d.hasPendingDecision))
                setup.HasPendingDecision = true;
            if (setupDecisions.Any(d => d.setupId == setup.Id && d.taxApplied == true))
                setup.TaxApplied = true;
        }


        return setups;
    }
}
