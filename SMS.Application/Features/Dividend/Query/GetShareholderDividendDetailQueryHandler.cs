using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public class ShareholderDividendPaymentDto
{
    public int Id { get; set; }
    public int PaymentId { get; set; }
    public int ShareholderId { get; set; }
    public int DividendSetupId { get; set; }
    public decimal Amount { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int WorkingDays { get; set; }
    public decimal WeightedAverageAmt { get; set; }
}
public record GetShareholderDividendDetailResult(List<ShareholderDividendPaymentDto> Payments, decimal TotalPaymentAmount, decimal TotalWeightedAveragePaymentAmount);
public record GetShareholderDividendDetailQuery(int SetupId, int ShareholderId) : IRequest<GetShareholderDividendDetailResult>;

public class GetShareholderDividendDetailQueryHandler : IRequestHandler<GetShareholderDividendDetailQuery, GetShareholderDividendDetailResult>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetShareholderDividendDetailQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<GetShareholderDividendDetailResult> Handle(GetShareholderDividendDetailQuery request, CancellationToken cancellationToken)
    {
        var payments = await dataService.PaymentsWeightedAverages
                                        .Where(p => p.DividendSetupId == request.SetupId && p.ShareholderId == request.ShareholderId)
                                        // .Include(p => p.Payment)
                                        .OrderByDescending(p => p.EffectiveDate)
                                        .ProjectTo<ShareholderDividendPaymentDto>(mapper.ConfigurationProvider)
                                        .ToListAsync();

        var totalPayments = payments.Sum(p => p.Amount);
        var totalWeightedPayments = payments.Sum(p => p.WeightedAverageAmt);

        return new GetShareholderDividendDetailResult(payments, totalPayments, totalWeightedPayments);
    }
}
