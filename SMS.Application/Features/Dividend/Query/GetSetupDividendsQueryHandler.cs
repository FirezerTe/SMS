using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record DividendDto(int Id,
                          int ShareholderId,
                          string ShareholderDisplayName,
                          int DividendSetupId,
                          decimal TotalPaidAmount,
                          decimal CapitalizeLimit,
                          decimal TotalPaidWeightedAverage,
                          decimal DividendAmount);

public record SetupDividendsDto(List<DividendDto> Dividends,
                                int pageNumber,
                                int pageSize,
                                int totalDividendsCount,
                                decimal totalSubscriptionPayments,
                                decimal totalWeightedSubscriptionPayments,
                                decimal totalDividends,
                                decimal totalCapitalizationLimit);

public record GetSetupDividendsQuery(int DividendSetupId, int PageNumber = 1, int PageSize = 20) : IRequest<SetupDividendsDto>;

public class GetSetupDividendsQueryHandler : IRequestHandler<GetSetupDividendsQuery, SetupDividendsDto>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetSetupDividendsQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }

    public async Task<SetupDividendsDto> Handle(GetSetupDividendsQuery request, CancellationToken cancellationToken)
    {
        var dividends = dataService.Dividends.Where(d => d.DividendSetupId == request.DividendSetupId);

        var result = await dividends.OrderByDescending(d => d.DividendAmount)
                                    .Skip(request.PageNumber * request.PageSize)
                                    .Take(request.PageSize)
                                    .ProjectTo<DividendDto>(mapper.ConfigurationProvider)
                                    .AsNoTracking()
                                    .ToListAsync();

        var totalSubscriptionPayments = await dividends.SumAsync(d => d.TotalPaidAmount);
        var totalWeightedSubscriptionPayments = await dividends.SumAsync(d => d.TotalPaidWeightedAverage);
        var totalDividends = await dividends.SumAsync(d => d.DividendAmount);
        var totalCapitalizationLimit = await dividends.SumAsync(d => d.CapitalizeLimit);
        var count = await dividends.CountAsync();

        return new SetupDividendsDto(Dividends: result,
                                     pageNumber: request.PageNumber,
                                     pageSize: request.PageSize,
                                     totalDividendsCount: count,
                                     totalSubscriptionPayments: totalSubscriptionPayments,
                                     totalWeightedSubscriptionPayments: totalWeightedSubscriptionPayments,
                                     totalDividends: totalDividends,
                                     totalCapitalizationLimit: totalCapitalizationLimit);
    }
}
