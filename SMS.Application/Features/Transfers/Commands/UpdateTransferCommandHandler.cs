using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;


[Authorize(Policy = AuthPolicy.CanCreateOrUpdateTransfer)]
public class UpdateTransferCommand : IRequest
{
    public int TransferId { get; set; }
    public TransferTypeEnum TransferType { get; set; }
    public TransferDividendTermEnum DividendTerm { get; set; }
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
public class UpdateTransferCommandHandler : IRequestHandler<UpdateTransferCommand>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public UpdateTransferCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }
    public async Task Handle(UpdateTransferCommand request, CancellationToken cancellationToken)
    {
        var transfer = await dataService.Transfers.FirstOrDefaultAsync(t => t.Id == request.TransferId);
        if (transfer == null)
        {
            return;
        }

        var transferees = (request.Transferees ?? new List<TransfereeDetail>())
        .Where(transferee => transferee.Amount > 0)
        .Select(t => new Transferee
        {
            ShareholderId = t.ShareholderId,
            Amount = t.Amount,
            Payments = transfer.Transferees?.FirstOrDefault(y => y.ShareholderId == t.ShareholderId)?.Payments ?? new List<TransferredPayment>()
        })
        .ToList();

        transfer.TotalTransferAmount = request.TotalTransferAmount;
        transfer.ServiceCharge = request.ServiceCharge;
        transfer.SellValue = request.SellValue;
        transfer.CapitalGainTax = request.CapitalGainTax;
        transfer.TransferType = request.TransferType;
        transfer.DividendTerm = request.DividendTerm;
        transfer.EffectiveDate = request.EffectiveDate;
        transfer.AgreementDate = request.AgreementDate;
        transfer.BranchId = request.BranchId;
        transfer.DistrictId = request.DistrictId;
        transfer.Note = request.Note?.Trim();

        var transfereeToRemove = transfer.Transferees.Where(t => !transferees.Any(n => n.ShareholderId == t.ShareholderId));
        transfer.Transferees.RemoveAll(t => transfereeToRemove.Any(x => x.ShareholderId == t.ShareholderId));
        // foreach (var transferee in transfereeToRemove)
        // {
        //     transfer.Transferees.Remove(transferee);
        // }
        var transfereeToAdd = transferees.Where(t => !transfer.Transferees.Any(n => n.ShareholderId == t.ShareholderId));
        transfer.Transferees.AddRange(transfereeToAdd);




        foreach (var transferee in transferees)
        {
            var existing = transfer.Transferees.FirstOrDefault(t => t.ShareholderId == transferee.ShareholderId);
            if (existing == null)
            {
                throw new Exception();
                // transfer.Transferees.Add(transferee);
                // continue;
            }

            existing.Amount = transferee.Amount;
        }

        // transfer.Transferees.Clear();

        // transfer.Transferees = transferees;

        transfer.AddDomainEvent(new TransferUpdatedEvent(transfer));

        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogTransferChange(transfer, ChangeType.Modified, cancellationToken);

    }
}
