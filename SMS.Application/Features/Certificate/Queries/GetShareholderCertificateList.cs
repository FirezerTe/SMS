using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Certificate.Queries.Certificate;

namespace SMS.Application.Features.Certificate.Queries
{
    public record GetShareholderCertificateQuery(int ShareholderId) : IRequest<CertificateSummeryDto>;
    public class GetShareholderCertificateQueryHandler : IRequestHandler<GetShareholderCertificateQuery, CertificateSummeryDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;
        public GetShareholderCertificateQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<CertificateSummeryDto> Handle(GetShareholderCertificateQuery request, CancellationToken cancellationToken)
        {
            var certificates = await dataService.Certficates.Where(cer => cer.ShareholderId == request.ShareholderId).ToListAsync();
            var shareholderAmountInformation = dataService.ShareholderSubscriptionsSummaries.Where(sh => sh.ShareholderId == request.ShareholderId).FirstOrDefault();
            var issuedCertificates = await dataService.Certficates.Where(cer => cer.ShareholderId == request.ShareholderId && cer.IsActive == true).ToListAsync();
            var totalIssuedPaidups = issuedCertificates.Sum(cer => cer.PaidupAmount);
            var totalAvailablePaidup = shareholderAmountInformation.ApprovedPaymentsAmount - totalIssuedPaidups;
            return new CertificateSummeryDto
            {
                Certificates = mapper.Map<List<CertificateDto>>(certificates),
                TotalAvailablePaidup = totalAvailablePaidup
            };

        }
    }
}