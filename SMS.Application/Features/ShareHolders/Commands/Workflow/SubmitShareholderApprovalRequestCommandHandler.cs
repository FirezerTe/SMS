using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;


[Authorize(Policy = AuthPolicy.CanSubmitShareholderApprovalRequest)]
public record SubmitShareholderApprovalRequestCommand(int Id, string Note) : IRequest;

public class SubmitShareholderApprovalRequestCommandHandler : IRequestHandler<SubmitShareholderApprovalRequestCommand>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;
    private readonly IShareholderSummaryService shareholderSummaryService;

    public SubmitShareholderApprovalRequestCommandHandler(IDataService dataService,
                                                          IMediator mediator,
                                                          IShareholderSummaryService shareholderSummaryService)
    {
        this.dataService = dataService;
        this.mediator = mediator;
        this.shareholderSummaryService = shareholderSummaryService;
    }
    public async Task Handle(SubmitShareholderApprovalRequestCommand request, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (shareholder != null)
        {
            shareholder.ApprovalStatus = ApprovalStatus.Submitted;
            await SubmitContactsChange(request);
            await SubmitBlockedStatusChange(request);
            await SubmitSubscriptionChanges(request);
            await SubmitSubscriptionPaymentChanges(request);
            await SubmitTransferChanges(request);
            await SubmitDividendDecisions(request);
            await SubmitCertificateChanges(request);


            await dataService.SaveAsync(cancellationToken);
            await mediator.Send(new AddShareholderCommentCommand(request.Id, CommentType.Submission, request.Note));
            await shareholderSummaryService.ComputeShareholderSummaries(request.Id, true, cancellationToken);
        }
    }

    private async Task SubmitDividendDecisions(SubmitShareholderApprovalRequestCommand request)
    {
        var draftDecisions = await dataService.DividendDecisions.Where(d => d.ApprovalStatus != ApprovalStatus.Approved
                                                                            && d.Decision != DividendDecisionType.Pending
                                                                            && d.Dividend.ShareholderId == request.Id).ToListAsync();
        foreach (var decision in draftDecisions)
        {
            decision.ApprovalStatus = ApprovalStatus.Submitted;
        }
    }

    private async Task SubmitTransferChanges(SubmitShareholderApprovalRequestCommand request)
    {
        var draftTransfers = await dataService.Transfers.Where(t => t.ApprovalStatus == ApprovalStatus.Draft && t.FromShareholderId == request.Id).ToListAsync();
        foreach (var transfer in draftTransfers)
            transfer.ApprovalStatus = ApprovalStatus.Submitted;
    }

    private async Task SubmitSubscriptionChanges(SubmitShareholderApprovalRequestCommand request)
    {
        var subscriptionsToSubmit = await dataService.Subscriptions
           .Where(c => c.ShareholderId == request.Id && c.ApprovalStatus == ApprovalStatus.Draft)
           .ToListAsync();

        foreach (var subscription in subscriptionsToSubmit)
        {
            subscription.ApprovalStatus = ApprovalStatus.Submitted;
        }
    }

    private async Task SubmitContactsChange(SubmitShareholderApprovalRequestCommand request)
    {
        var contactsToSubmit = await dataService.Contacts
            .Where(c => c.ShareholderId == request.Id && c.ApprovalStatus == ApprovalStatus.Draft)
            .ToListAsync();

        foreach (var contact in contactsToSubmit)
            contact.ApprovalStatus = ApprovalStatus.Submitted;
    }

    private async Task SubmitBlockedStatusChange(SubmitShareholderApprovalRequestCommand request)
    {
        var blockedStatuses = await dataService.BlockedShareholders
            .Where(b => b.ShareholderId == request.Id && b.ApprovalStatus == ApprovalStatus.Draft)
            .ToListAsync();

        foreach (var blockedStatus in blockedStatuses)
            blockedStatus.ApprovalStatus = ApprovalStatus.Submitted;
    }

    private async Task SubmitSubscriptionPaymentChanges(SubmitShareholderApprovalRequestCommand request)
    {
        var payments = await dataService.Payments
            .Where(payment => payment.ApprovalStatus == ApprovalStatus.Draft && payment.Subscription.ShareholderId == request.Id)
            .ToListAsync();

        foreach (var payment in payments)
            payment.ApprovalStatus = ApprovalStatus.Submitted;

    }
    private async Task SubmitCertificateChanges(SubmitShareholderApprovalRequestCommand request)
    {
        var certificates = await dataService.Certficates
            .Where(certificate => certificate.ApprovalStatus == ApprovalStatus.Draft && certificate.ShareholderId == request.Id)
            .ToListAsync();

        foreach (var certificate in certificates)
            certificate.ApprovalStatus = ApprovalStatus.Submitted;

    }
}
