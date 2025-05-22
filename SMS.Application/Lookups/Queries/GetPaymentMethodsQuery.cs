using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Application.Lookups;

public record GetPaymentMethodsQuery : IRequest<List<PaymentMethod>>;

public class GetPaymentMethodsQueryHandler : IRequestHandler<GetPaymentMethodsQuery, List<PaymentMethod>>
{
    private readonly IDataService dataService;

    public GetPaymentMethodsQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }


    public async Task<List<PaymentMethod>> Handle(GetPaymentMethodsQuery request, CancellationToken cancellationToken)
    {
        return await dataService.PaymentMethods.ToListAsync();
    }
}
