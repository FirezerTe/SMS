using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdatePayment)]
public record AddPaymentAdjustmentCommand(
    int ParentPaymentId,
    decimal Amount,
    PaymentTypeEnum PaymentType,
    int? BranchId,
    int? DistrictId,
    string Note) : IRequest;
public class AddPaymentAdjustmentCommandHandler : IRequestHandler<AddPaymentAdjustmentCommand>
{
    private readonly IDataService dataService;
    private readonly IPaymentService paymentService;

    public AddPaymentAdjustmentCommandHandler(IDataService dataService, IPaymentService paymentService)
    {
        this.dataService = dataService;
        this.paymentService = paymentService;
    }
    public async Task Handle(AddPaymentAdjustmentCommand request, CancellationToken cancellationToken)
    {
        var parentPayment = await dataService.Payments.FirstOrDefaultAsync(p => p.Id == request.ParentPaymentId);
        if (parentPayment == null) return;

        await paymentService.AddNewPaymentAndSave(new NewPaymentDto(
            Amount: request.Amount,
            SubscriptionId: parentPayment.SubscriptionId,
            GeneralLedgerId: parentPayment.GeneralLedgerEnum,
            PaymentDate: parentPayment.EffectiveDate,
            PaymentType: request.PaymentType,
            PaymentMethod: parentPayment.PaymentMethodEnum,
            ForeignCurrencyId: parentPayment.ForeignCurrencyId,
            ForeignCurrencyAmount: parentPayment.ForeignCurrencyAmount,
            DistrictId: request.DistrictId ?? parentPayment.DistrictId,
            BranchId: request.BranchId ?? parentPayment.BranchId,
            OriginalReferenceNo: parentPayment.OriginalReferenceNo,
            PaymentReceiptNo: parentPayment.PaymentReceiptNo,
            Note: string.IsNullOrWhiteSpace(request.Note) ? "Adjustment payment" : request.Note,
            parentPaymentId: request.ParentPaymentId
        ), cancellationToken);
    }
}
