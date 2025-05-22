using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

public record TransferPayments(int ShareholderId, decimal Amount);

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateTransfer)]
public record SavePaymentTransfersCommand(int TransferId, int PaymentId, List<TransferPayments> Payments) : IRequest;

public class SavePaymentTransfersCommandHandler : IRequestHandler<SavePaymentTransfersCommand>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public SavePaymentTransfersCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }
    public async Task Handle(SavePaymentTransfersCommand request, CancellationToken cancellationToken)
    {
        var transfer = await dataService.Transfers.FirstOrDefaultAsync(t => t.Id == request.TransferId);

        if (transfer == null) return;

        foreach (var transferee in transfer.Transferees)
        {
            var payments = transferee.Payments.Where(p => p.PaymentId != request.PaymentId).ToList() ?? new List<TransferredPayment>();

            var currentPayment = transferee.Payments.FirstOrDefault(p => p.PaymentId == request.PaymentId);
            if (currentPayment != null)
                transferee.Payments.Remove(currentPayment);
            var payment = request.Payments.FirstOrDefault(p => p.ShareholderId == transferee.ShareholderId && p.Amount > 0);
            if (payment != null)
            {
                transferee.Payments.Add(new TransferredPayment
                {
                    Amount = payment.Amount,
                    PaymentId = request.PaymentId
                });
            }
        }
        transfer.AddDomainEvent(new TransferUpdatedEvent(transfer));
        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogTransferChange(transfer, ChangeType.Modified, cancellationToken);

    }
}
