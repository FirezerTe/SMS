using AutoMapper;
using MediatR;
using SMS.Application.Exceptions;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Certificate.Command;

public class UpdateShareholderCertificateCommand : IRequest<int>
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
public class UpdateShareholderCertficateCommandHandler : IRequestHandler<UpdateShareholderCertificateCommand, int>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public UpdateShareholderCertficateCommandHandler(IDataService dataService, IMapper mapper, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.mapper = mapper;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public async Task<int> Handle(UpdateShareholderCertificateCommand request, CancellationToken cancellationToken)
    {
        var shareholderCertificate = dataService.Certficates.FirstOrDefault(x => x.Id == request.Id);
        if (shareholderCertificate == null)
        {
            throw new NotFoundException($"Unable to find shareholder", request);
        }

        shareholderCertificate.PaidupAmount = request.PaidupAmount;
        shareholderCertificate.PaymentMethodEnum = request.PaymentMethodEnum;
        shareholderCertificate.CertificateIssuanceTypeEnum = request.CertificateIssuanceTypeEnum;
        shareholderCertificate.IssueDate = request.IssueDate;
        shareholderCertificate.Note = request.Note;
        shareholderCertificate.CertificateNo = request.CertificateNo;
        shareholderCertificate.ReceiptNo = request.ReceiptNo;

        shareholderCertificate.AddDomainEvent(new CertficateUpdatedEvent(shareholderCertificate));
        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogCertificateChange(shareholderCertificate, ChangeType.Modified, cancellationToken);
        return shareholderCertificate.Id;
    }
}