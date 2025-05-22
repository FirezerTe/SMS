using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateTransfer)]
public record DeleteTransferCommand(int Id) : IRequest;

public class DeleteTransferCommandHandler : IRequestHandler<DeleteTransferCommand>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public DeleteTransferCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }
    public async Task Handle(DeleteTransferCommand request, CancellationToken cancellationToken)
    {
        var transfer = await dataService.Transfers.FirstOrDefaultAsync(t => t.Id == request.Id);
        if (transfer != null)
        {
            dataService.Transfers.Remove(transfer);
            await dataService.SaveAsync(cancellationToken);
            await shareholderChangeLogService.LogTransferChange(transfer, Domain.ChangeType.Deleted, cancellationToken);
        }
    }
}
