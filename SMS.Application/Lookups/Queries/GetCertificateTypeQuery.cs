using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Application.Lookups;

public record GetCertificateTypeQuery : IRequest<List<CertficateType>>;

public class GetCertificateTypeQueryHandler : IRequestHandler<GetCertificateTypeQuery, List<CertficateType>>
{
    private readonly IDataService dataService;

    public GetCertificateTypeQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }


    public async Task<List<CertficateType>> Handle(GetCertificateTypeQuery request, CancellationToken cancellationToken)
    {
        return await dataService.CertficateTypes.ToListAsync();
    }
}