using MediatR;
using Microsoft.EntityFrameworkCore;

using SMS.Domain;

namespace SMS.Application.Lookups;

public record GetPaymentTypesQuery : IRequest<List<PaymentType>>;

public class GetPaymentTypesQueryHandler : IRequestHandler<GetPaymentTypesQuery, List<PaymentType>>
{
    private readonly IDataService dataService;

    public GetPaymentTypesQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }


    public async Task<List<PaymentType>> Handle(GetPaymentTypesQuery request, CancellationToken cancellationToken)
    {
        return await dataService.PaymentTypes.ToListAsync();
    }
}
