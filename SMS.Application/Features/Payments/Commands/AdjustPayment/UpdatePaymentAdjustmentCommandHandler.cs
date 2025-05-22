using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdatePayment)]
public record UpdatePaymentAdjustmentCommand(
    int PaymentId,
    decimal Amount,
    PaymentTypeEnum PaymentType,
    int? BranchId,
    int? DistrictId,
    string Note) : IRequest;

public class UpdatePaymentAdjustmentCommandHandler : IRequestHandler<UpdatePaymentAdjustmentCommand>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public UpdatePaymentAdjustmentCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }
    public async Task Handle(UpdatePaymentAdjustmentCommand request, CancellationToken cancellationToken)
    {
        var adjustment = await dataService.Payments.FirstOrDefaultAsync(p => p.Id == request.PaymentId);
        if (adjustment == null) return;

        adjustment.Amount = request.Amount;
        adjustment.PaymentTypeEnum = request.PaymentType;
        adjustment.BranchId = request.BranchId;
        adjustment.DistrictId = request.DistrictId;
        adjustment.Note = request.Note;

        adjustment.AddDomainEvent(new PaymentAddedEvent(adjustment));

        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogPaymentChange(adjustment, ChangeType.Modified, cancellationToken);
    }
}
