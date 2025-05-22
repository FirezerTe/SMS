using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Certificate.Queries;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Certificate.Command
{
    public record ActivateShareholderCertificateCommand(int certficateId) : IRequest<CertificateDto>;
    public class ActivateShareholderCertificateCommandHandler : IRequestHandler<ActivateShareholderCertificateCommand, CertificateDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;
        private readonly IShareholderChangeLogService shareholderChangeLogService;

        public ActivateShareholderCertificateCommandHandler(IDataService dataService, IMapper mapper, IShareholderChangeLogService shareholderChangeLogService)
        {
            this.dataService = dataService;
            this.mapper = mapper;
            this.shareholderChangeLogService = shareholderChangeLogService;
        }
        public async Task<CertificateDto> Handle(ActivateShareholderCertificateCommand request, CancellationToken cancellationToken)
        {
            var shareholderCertficate = dataService.Certficates.Where(cer => cer.Id == request.certficateId).FirstOrDefault();
            if (shareholderCertficate != null)
            {
                shareholderCertficate.IsActive = true;
                shareholderCertficate.ApprovalStatus = ApprovalStatus.Draft;
                var shareholder = await dataService.Shareholders.Where(p => p.Id == shareholderCertficate.ShareholderId).FirstOrDefaultAsync();

                if (shareholder != null)
                    shareholder.ApprovalStatus = ApprovalStatus.Draft;
            }


            await dataService.SaveAsync(cancellationToken);
            await shareholderChangeLogService.LogCertificateChange(shareholderCertficate, ChangeType.Modified, cancellationToken);
            return mapper.Map<CertificateDto>(shareholderCertficate);
        }
    }
}