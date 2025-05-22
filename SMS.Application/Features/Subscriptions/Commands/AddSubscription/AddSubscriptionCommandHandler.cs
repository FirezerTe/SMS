using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;


[Authorize(Policy = AuthPolicy.CanCreateOrUpdateSubscription)]
public record AddSubscriptionCommand(
    decimal Amount,
    DateTime SubscriptionDate,
    DateOnly SubscriptionPaymentDueDate,
    int ShareholderId,
    int SubscriptionGroupID,
    int SubscriptionDistrictID,
    int SubscriptionBranchID,
    string? SubscriptionOriginalReferenceNo,
    string? PremiumPaymentReceiptNo) : IRequest;

public class AddSubscriptionCommandHandler : IRequestHandler<AddSubscriptionCommand>
{
    private readonly IDataService dataService;
    private readonly IPaymentService paymentService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public AddSubscriptionCommandHandler(IDataService dataService, IPaymentService paymentService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.paymentService = paymentService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public async Task Handle(AddSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var hasApprovedSubscription = await dataService.Subscriptions.AnyAsync(s => s.ShareholderId == request.ShareholderId && s.ApprovalStatus == ApprovalStatus.Approved);

        var subscription = new Subscription()
        {
            Amount = request.Amount,
            SubscriptionDate = request.SubscriptionDate,
            SubscriptionPaymentDueDate = request.SubscriptionPaymentDueDate,
            ShareholderId = request.ShareholderId,
            SubscriptionGroupID = request.SubscriptionGroupID,
            SubscriptionDistrictID = request.SubscriptionDistrictID,
            SubscriptionBranchID = request.SubscriptionBranchID,
            SubscriptionOriginalReferenceNo = request.SubscriptionOriginalReferenceNo,
            PremiumPaymentReceiptNo = request.PremiumPaymentReceiptNo,
            PremiumPayment = hasApprovedSubscription ? null : await paymentService.ComputeSubscriptionPremiumPayment(request.Amount, request.SubscriptionGroupID)
        };

        dataService.Subscriptions.Add(subscription);

        subscription.AddDomainEvent(new SubscriptionAddedEvent(subscription));

        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogSubscriptionChange(subscription, ChangeType.Added, cancellationToken);

    }
}
