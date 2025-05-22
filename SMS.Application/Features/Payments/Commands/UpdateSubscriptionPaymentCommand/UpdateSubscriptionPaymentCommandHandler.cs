using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdatePayment)]
public record UpdateSubscriptionPaymentCommand(
    int Id,
    decimal Amount,
    int SubscriptionId,
    DateTime PaymentDate,
    PaymentTypeEnum PaymentType,
    PaymentMethodEnum PaymentMethod,
    int? ForeignCurrencyId,
    decimal? ForeignCurrencyAmount,
    int? DistrictId,
    int? BranchId,
    string? OriginalReferenceNo,
    string? PaymentReceiptNo,
    string? Note
) : IRequest;

public class UpdateSubscriptionPaymentCommandHandler : IRequestHandler<UpdateSubscriptionPaymentCommand>
{
    private readonly IDataService dataService;
    private readonly IShareholderSummaryService shareholderSummaryService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public UpdateSubscriptionPaymentCommandHandler(IDataService dataService,
                                                   IShareholderSummaryService shareholderSummaryService,
                                                   IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderSummaryService = shareholderSummaryService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }


    public async Task Handle(UpdateSubscriptionPaymentCommand request, CancellationToken cancellationToken)
    {
        var payment = await dataService.Payments.Include(p => p.Subscription)
                                                           .ThenInclude(p => p.SubscriptionGroup)
                                                           .FirstOrDefaultAsync(s => s.Id == request.Id && s.SubscriptionId == request.SubscriptionId);


        if (payment == null)
        {
            throw new NotFoundException($"Unable to find payment", request);
        }

        var previousApprovalStatus = payment.ApprovalStatus;

        payment.Amount = request.Amount;
        payment.SubscriptionId = request.SubscriptionId;
        payment.EffectiveDate = request.PaymentDate;
        payment.PaymentTypeEnum = request.PaymentType;
        payment.PaymentMethodEnum = request.PaymentMethod;
        payment.BranchId = request.BranchId;
        payment.DistrictId = request.DistrictId;
        payment.OriginalReferenceNo = request.OriginalReferenceNo;
        payment.PaymentReceiptNo = request.PaymentReceiptNo;
        payment.Note = request.Note;
        payment.ForeignCurrencyId = request.ForeignCurrencyId;
        payment.ForeignCurrencyAmount = request.ForeignCurrencyAmount;

        payment.AddDomainEvent(new PaymentUpdatedEvent(payment, previousApprovalStatus));

        await dataService.SaveAsync(cancellationToken);
        if (previousApprovalStatus != ApprovalStatus.Draft)
            await shareholderSummaryService.ComputeShareholderSummaries(payment.Subscription.ShareholderId, true, cancellationToken);

        await shareholderChangeLogService.LogPaymentChange(payment, ChangeType.Modified, cancellationToken);
    }
}
