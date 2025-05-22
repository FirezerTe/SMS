using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;


namespace SMS.Application.Features.Certificate.Command
{
    public class PrepareShareholderCertificateCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string CertificateNo { get; set; }
        public string? SerialNumberRange { get; set; }
        public PaymentMethodEnum PaymentMethodEnum { get; set; }
        public CertificateIssuanceTypeEnum CertificateIssuanceTypeEnum { get; set; }
        public int ShareholderId { get; set; }
        public DateOnly IssueDate { get; set; }
        public decimal PaidupAmount { get; set; }
        public string? ReceiptNo { get; set; }
        public string? Note { get; set; }
    }
    public class PrepareShareholderCertificateCommandHandler : IRequestHandler<PrepareShareholderCertificateCommand, int>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        private readonly IShareholderChangeLogService shareholderChangeLogService;

        public PrepareShareholderCertificateCommandHandler(IMapper mapper, IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
            this.shareholderChangeLogService = shareholderChangeLogService;
        }

        public async Task<int> Handle(PrepareShareholderCertificateCommand request, CancellationToken cancellationToken)
        {

            var certificate = mapper.Map<Certficate>(request);
            certificate.IsActive = true;

            dataService.Certficates.Add(certificate);
            var shareholder = await dataService.Shareholders.Where(p => p.Id == certificate.ShareholderId).FirstOrDefaultAsync();


            if (shareholder != null)
                shareholder.ApprovalStatus = ApprovalStatus.Draft;

            certificate.AddDomainEvent(new CertficateCreatedEvent(certificate));
            await dataService.SaveAsync(cancellationToken);
            await shareholderChangeLogService.LogCertificateChange(certificate, ChangeType.Added, cancellationToken);

            return await Task.FromResult(certificate.Id);
        }
    }
}