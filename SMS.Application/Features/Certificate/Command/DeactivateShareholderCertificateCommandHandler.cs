using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Certificate.Queries;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Certificate.Command
{
    public record DeactivateShareholderCertificateCommand(int certficateId) : IRequest<CertificateDto>;
    public class DeactivateShareholderCertificateCommandHandler : IRequestHandler<DeactivateShareholderCertificateCommand, CertificateDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;
        private readonly IShareholderChangeLogService shareholderChangeLogService;
        public DeactivateShareholderCertificateCommandHandler(IDataService dataService, IMapper mapper, IShareholderChangeLogService shareholderChangeLogService)
        {
            this.dataService = dataService;
            this.mapper = mapper;
            this.shareholderChangeLogService = shareholderChangeLogService;
        }
        public async Task<CertificateDto> Handle(DeactivateShareholderCertificateCommand request, CancellationToken cancellationToken)
        {
            var shareholderCertficate = dataService.Certficates.Where(cer => cer.Id == request.certficateId).FirstOrDefault();
            if (shareholderCertficate != null)
            {
                shareholderCertficate.IsActive = false;
                shareholderCertficate.ApprovalStatus = ApprovalStatus.Draft;

                var shareholder = await dataService.Shareholders.Where(p => p.Id == shareholderCertficate.ShareholderId).FirstOrDefaultAsync();

                if (shareholder != null)
                    shareholder.ApprovalStatus = ApprovalStatus.Draft;
            }
            await dataService.SaveAsync(cancellationToken);
            await shareholderChangeLogService.LogCertificateChange(shareholderCertficate, ChangeType.Deactivated, cancellationToken);
            return mapper.Map<CertificateDto>(shareholderCertficate);
        }
    }
}