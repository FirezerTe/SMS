using MediatR;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

public class TransferredPaymentDto
{
    public int PaymentId { get; set; }
    public decimal Amount { get; set; }
}

public class TransfereeDetail
{
    public int ShareholderId { get; set; }
    public decimal Amount { get; set; }
    public List<TransferredPaymentDto>? Payments { get; set; } = new List<TransferredPaymentDto>();
}

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateTransfer)]
public class AddNewTransferCommand : IRequest
{
    public TransferTypeEnum TransferType { get; set; }
    public TransferDividendTermEnum DividendTerm { get; set; }
    public int FromShareholderId { get; set; }
    public decimal TotalTransferAmount { get; set; }
    public decimal? SellValue { get; set; }
    public decimal? ServiceCharge { get; set; }
    public decimal? CapitalGainTax { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public DateOnly AgreementDate { get; set; }

    public int BranchId { get; set; }
    public int DistrictId { get; set; }
    public string? Note { get; set; }

    public required ICollection<TransfereeDetail> Transferees { get; set; }
}

internal class AddNewTransferCommandHandler : IRequestHandler<AddNewTransferCommand>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public AddNewTransferCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public async Task Handle(AddNewTransferCommand request, CancellationToken cancellationToken)
    {

        var transferees = (request.Transferees ?? new List<TransfereeDetail>()).Select(x => new Transferee
        {
            ShareholderId = x.ShareholderId,
            Amount = x.Amount,
            Payments = new List<TransferredPayment>()
        }).ToList();



        var transfer = new Transfer()
        {
            TransferType = request.TransferType,
            DividendTerm = request.DividendTerm,
            FromShareholderId = request.FromShareholderId,
            TotalTransferAmount = request.TotalTransferAmount,
            ServiceCharge = request.ServiceCharge,
            SellValue = request.SellValue,
            CapitalGainTax = request.CapitalGainTax,
            EffectiveDate = request.EffectiveDate,
            AgreementDate = request.AgreementDate,
            BranchId = request.BranchId,
            DistrictId = request.DistrictId,
            Note = request.Note?.Trim(),
            Transferees = transferees
        };

        dataService.Transfers.Add(transfer);
        transfer.AddDomainEvent(new TransferAddedEvent(transfer));
        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogTransferChange(transfer, ChangeType.Added, cancellationToken);

    }
}
