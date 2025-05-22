using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateSubscription)]
public record UpdateSubscriptionCommand(
    int Id,
    decimal Amount,
    DateTime SubscriptionDate,
    DateOnly SubscriptionPaymentDueDate,
    int ShareholderId,
    int SubscriptionGroupID,
    int SubscriptionDistrictID,
    int SubscriptionBranchID,
    string? SubscriptionOriginalReferenceNo,
    string? PremiumPaymentReceiptNo) : IRequest;

public class UpdateSubscriptionCommandHandler : IRequestHandler<UpdateSubscriptionCommand>
{
    private readonly IDataService dataService;
    private readonly IPaymentService paymentService;
    private readonly IShareholderSummaryService shareholderSummaryService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public UpdateSubscriptionCommandHandler(IDataService dataService,
                                            IPaymentService paymentService,
                                            IShareholderSummaryService shareholderSummaryService,
                                            IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.paymentService = paymentService;
        this.shareholderSummaryService = shareholderSummaryService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public async Task Handle(UpdateSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var subscription = dataService.Subscriptions
            .Include(s => s.SubscriptionGroup)
            .FirstOrDefault(s => s.Id == request.Id && s.ShareholderId == request.ShareholderId);


        if (subscription == null)
        {
            throw new NotFoundException($"Unable to find subscription", request);
        }
        var hasApprovedSubscription = await dataService.Subscriptions.AnyAsync(s => s.ShareholderId == request.ShareholderId && s.ApprovalStatus == ApprovalStatus.Approved);

        var previousApprovalStatus = subscription.ApprovalStatus;
        subscription.Amount = request.Amount;
        subscription.SubscriptionDate = request.SubscriptionDate;
        subscription.SubscriptionPaymentDueDate = request.SubscriptionPaymentDueDate;
        subscription.ShareholderId = request.ShareholderId;
        subscription.SubscriptionGroupID = request.SubscriptionGroupID;
        subscription.SubscriptionDistrictID = request.SubscriptionDistrictID;
        subscription.SubscriptionBranchID = request.SubscriptionBranchID;
        subscription.PremiumPaymentReceiptNo = request.PremiumPaymentReceiptNo;
        subscription.SubscriptionOriginalReferenceNo = request.SubscriptionOriginalReferenceNo;
        subscription.PremiumPayment = hasApprovedSubscription ? null : await paymentService.ComputeSubscriptionPremiumPayment(request.Amount, request.SubscriptionGroupID);

        subscription.AddDomainEvent(new SubscriptionUpdatedEvent(subscription));

        await dataService.SaveAsync(cancellationToken);
        if (previousApprovalStatus != ApprovalStatus.Draft)
        {
            if (previousApprovalStatus != ApprovalStatus.Draft)
                await shareholderSummaryService.ComputeShareholderSummaries(subscription.ShareholderId, true, cancellationToken);
        }

        await shareholderChangeLogService.LogSubscriptionChange(subscription, ChangeType.Modified, cancellationToken);

    }
}
