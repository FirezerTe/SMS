using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;


public class SubmitShareholderApprovalRequestCommandValidator : AbstractValidator<SubmitShareholderApprovalRequestCommand>
{
    private readonly IDataService dataService;
    private readonly IDividendService dividendService;

    public SubmitShareholderApprovalRequestCommandValidator(IDataService dataService, IDividendService dividendService)
    {
        this.dataService = dataService;
        this.dividendService = dividendService;
        RuleFor(p => p.Note).NotEmpty().WithMessage("Comment is required for submission.");
        RuleFor(p => p)
            .Must(Exist)
            .WithMessage(x => $"Unable to find shareholder.");
        RuleFor(p => p)
            .Must(ShouldHaveDraftForApprovalStatus)
            .WithMessage(x => $"Cannot submit a non-draft record");

        RuleFor(p => p).MustAsync(HaveSubscriptionDocumentsAttached).WithMessage("Subscription Form attachment is required");
        RuleFor(p => p).MustAsync(HaveSubscriptionPremiumPaymentReceiptAttachment).WithMessage("Premium Payment Receipt attachment is required");
        RuleFor(p => p).MustAsync(HaveBlockingDocumentAttachment).WithMessage("Blocking attachment is required");
        RuleFor(p => p).MustAsync(PayTheMinimumFirstTimePayment).WithMessage("Minimum first time payment for new subscription is not met.");
        RuleFor(p => p).MustAsync(SubscriptionPaymentReceiptsAttached).WithMessage("Subscription Payment Receipt attachment is required");
        RuleFor(p => p).MustAsync(HaveValidTransferAmount).WithMessage("Transferred amount doesn't match with Amount to transfer");
        RuleFor(p => p).MustAsync(HaveValidTransferSaleValue).WithMessage("Transfer Sell value is required");
        RuleFor(p => p).MustAsync(HaveValidCapitalGainTaxValue).WithMessage("Transfer Capital Gain Tax is required");
        RuleFor(p => p).MustAsync(HaveValidTransferEffectiveDate).WithMessage("Transfer Effective Date should be within the current dividend period");
        RuleFor(p => p).MustAsync(HaveTransferAgreementFormAttachment).WithMessage("Transfer Agreement Form is not attached");
        RuleFor(p => p).MustAsync(HaveTransferCapitalGainTaxReceiptAttachment).WithMessage("Transfer Capital Gain Tax Receipt is not attached");
        RuleFor(p => p).MustAsync(HaveDividendDecisionAttachment).WithMessage("Dividend Decision attachment is required");
        RuleFor(p => p).MustAsync(HaveBirthCertificateAttachment).WithMessage("Birth certificate attachment is required for shareholders less than 18 years old");
    }

    private async Task<bool> HaveBirthCertificateAttachment(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == command.Id);
        if (shareholder == null || shareholder.DateOfBirth == null) return true;


        var dateOfBirth = shareholder.DateOfBirth.Value.ToDateTime(TimeOnly.Parse("00:00"));

        int calculatedAge = DateTime.Today.Year - dateOfBirth.Year;
        if (dateOfBirth > DateTime.Today.AddYears(-calculatedAge))
        {
            calculatedAge--;
        }

        var isMinor = calculatedAge < 18;
        if (!isMinor) return true;

        var hasBirthCertificateCertificate = await dataService.ShareholderDocuments.AnyAsync(d => d.ShareholderId == command.Id && d.DocumentType == DocumentType.BirthCertificate);

        return hasBirthCertificateCertificate;
    }

    private async Task<bool> HaveDividendDecisionAttachment(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var draftDecisions = await dataService.DividendDecisions.Where(d => d.ApprovalStatus != ApprovalStatus.Approved
                                                                            && d.Decision != DividendDecisionType.Pending
                                                                            && d.Dividend.ShareholderId == command.Id).ToListAsync();

        if (!draftDecisions.Any()) return true;

        return draftDecisions.Any(d => !string.IsNullOrWhiteSpace(d.AttachmentDocumentId));
    }

    private async Task<bool> HaveTransferCapitalGainTaxReceiptAttachment(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var unapprovedSaleTransfers = await dataService.Transfers.Where(t => t.FromShareholderId == command.Id
                                                    && t.ApprovalStatus != ApprovalStatus.Approved
                                                    && t.TransferType == Domain.TransferTypeEnum.Sale).ToListAsync();

        var transfersSoldWithProfit = unapprovedSaleTransfers.Where(t => (t.SellValue ?? 0) > t.TotalTransferAmount).ToList();

        if (transfersSoldWithProfit.Count == 0) return true;

        var transferIds = transfersSoldWithProfit.Select(t => t.Id).ToList();
        var docs = await dataService.TransferDocuments.Where(d => transferIds.Contains(d.TransferId) && d.DocumentType == Domain.TransferDocumentType.CapitalGainTaxReceipt).ToListAsync();

        return !transferIds.Any(id => !docs.Any(d => d.TransferId == id));
    }

    private async Task<bool> HaveTransferAgreementFormAttachment(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var unapprovedTransfers = await dataService.Transfers.Where(t => t.FromShareholderId == command.Id && t.ApprovalStatus != ApprovalStatus.Approved).ToListAsync();
        if (unapprovedTransfers.Count == 0) return true;

        var transferIds = unapprovedTransfers.Select(t => t.Id).ToList();
        var docs = await dataService.TransferDocuments.Where(d => transferIds.Contains(d.TransferId) && d.DocumentType == Domain.TransferDocumentType.Agreement).ToListAsync();

        return !transferIds.Any(id => !docs.Any(d => d.TransferId == id));
    }

    private async Task<bool> HaveValidCapitalGainTaxValue(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var unapprovedTransfers = await dataService.Transfers.Where(t => t.FromShareholderId == command.Id && t.ApprovalStatus != ApprovalStatus.Approved).ToListAsync();
        foreach (var transfer in unapprovedTransfers)
        {
            var sellValue = transfer.SellValue ?? 0;
            var capitalGainTax = transfer.CapitalGainTax ?? 0;
            var transferAmount = transfer.TotalTransferAmount;
            if (transfer.TransferType == Domain.TransferTypeEnum.Sale && sellValue > transferAmount && capitalGainTax <= 0)
            {
                return false;
            }
        }

        return true;
    }

    private async Task<bool> HaveValidTransferEffectiveDate(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var unapprovedTransfers = await dataService.Transfers.Where(t => t.FromShareholderId == command.Id && t.ApprovalStatus != ApprovalStatus.Approved).ToListAsync();
        var currentDividendPeriod = await dividendService.GetCurrentDividendPeriod();
        if (currentDividendPeriod == null) return false;

        var startDate = currentDividendPeriod.StartDate;
        var endDate = currentDividendPeriod.EndDate.AddDays(1);

        foreach (var transfer in unapprovedTransfers)
        {
            if (transfer.EffectiveDate < startDate || transfer.EffectiveDate > endDate)
            {
                return false;
            }
        }

        return true;
    }

    private async Task<bool> HaveValidTransferSaleValue(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var unapprovedTransfers = await dataService.Transfers.Where(t => t.FromShareholderId == command.Id && t.ApprovalStatus != ApprovalStatus.Approved).ToListAsync();
        foreach (var transfer in unapprovedTransfers)
        {
            if (transfer.TransferType == Domain.TransferTypeEnum.Sale && (transfer.SellValue ?? 0) <= 0)
            {
                return false;
            }
        }

        return true;
    }

    private async Task<bool> HaveValidTransferAmount(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var unapprovedTransfers = await dataService.Transfers.Where(t => t.FromShareholderId == command.Id && t.ApprovalStatus != ApprovalStatus.Approved).ToListAsync();
        foreach (var transfer in unapprovedTransfers)
        {
            if (transfer.Transferees.Sum(t => t.Amount) != transfer.TotalTransferAmount) return false;

            foreach (var transferee in transfer.Transferees)
                if (transferee.Amount != transferee.Payments.Sum(p => p.Amount)) return false;
        }

        return true;
    }

    private async Task<bool> SubscriptionPaymentReceiptsAttached(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var unapprovedSubscriptionPaymentIds = await dataService.Payments
            .Where(payment => payment.ApprovalStatus != ApprovalStatus.Approved && payment.PaymentTypeEnum == PaymentTypeEnum.SubscriptionPayment && payment.Subscription.ShareholderId == command.Id)
            .Select(p => p.Id)
            .ToListAsync();

        if (unapprovedSubscriptionPaymentIds.Count == 0) return true;

        var receipts = await dataService.PaymentReceipts.Where(r => unapprovedSubscriptionPaymentIds.Contains(r.PaymentId)).ToListAsync();

        return !unapprovedSubscriptionPaymentIds.Any(pId => !receipts.Select(r => r.PaymentId).Contains(pId));
    }

    private async Task<bool> HaveBlockingDocumentAttachment(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == command.Id);
        if (shareholder == null || !shareholder.IsBlocked) return true;

        var blockageDetail = await dataService.BlockedShareholders.FirstOrDefaultAsync(s => s.ShareholderId == command.Id);

        return blockageDetail != null
               && blockageDetail.Attachments != null
               && blockageDetail.Attachments.Count > 0;
    }

    private async Task<bool> PayTheMinimumFirstTimePayment(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var unapprovedSubscription = await dataService.Subscriptions.Where(s => s.ShareholderId == command.Id && s.ApprovalStatus != ApprovalStatus.Approved)
                                                                       .ToListAsync();

        if (unapprovedSubscription.Count == 0) return true;
        var subscriptionGroupIds = unapprovedSubscription.Select(x => x.SubscriptionGroupID).ToList();

        var subscriptionGroups = await dataService.SubscriptionGroups.Where(s => subscriptionGroupIds.Contains(s.Id)).ToListAsync();

        foreach (var subscription in unapprovedSubscription)
        {
            var subscriptionGroup = subscriptionGroups.FirstOrDefault(s => s.Id == subscription.SubscriptionGroupID);
            if (subscriptionGroup == null) return false;
            var minFirstTimePayment = subscriptionGroup.MinFirstPaymentAmount ?? 0;

            var minFirstTimePaymentAmountReq = subscriptionGroup.MinFirstPaymentAmountUnit == PaymentUnit.Percentage ? subscription.Amount * minFirstTimePayment / 100 : minFirstTimePayment;

            var totalPayments = await dataService.Payments.Where(p => p.SubscriptionId == subscription.Id).SumAsync(x => x.Amount);

            if (totalPayments < minFirstTimePaymentAmountReq) return false;
        }

        return true;
    }

    private async Task<bool> HaveSubscriptionDocumentsAttached(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var unapprovedSubscriptionIds = await dataService.Subscriptions.Where(s => s.ShareholderId == command.Id && s.ApprovalStatus != ApprovalStatus.Approved)
                                                              .Select(x => x.Id)
                                                              .ToListAsync();

        if (unapprovedSubscriptionIds.Count == 0) return true;

        var documents = await dataService.SubscriptionDocuments.Where(d => unapprovedSubscriptionIds.Contains(d.SubscriptionId))
                                                               .ToListAsync();

        foreach (var subscriptionId in unapprovedSubscriptionIds)
        {
            if (!documents.Any(d => d.SubscriptionId == subscriptionId && d.DocumentType == DocumentType.SubscriptionForm)) return false;
        }

        return true;
    }

    private async Task<bool> HaveSubscriptionPremiumPaymentReceiptAttachment(SubmitShareholderApprovalRequestCommand command, CancellationToken token)
    {
        var hasApprovedSubscription = await dataService.Subscriptions.AnyAsync(s => s.ShareholderId == command.Id && s.ApprovalStatus == ApprovalStatus.Approved);

        if (hasApprovedSubscription) return true;


        var unapprovedSubscriptionIds = await dataService.Subscriptions.Where(s => s.ShareholderId == command.Id && s.ApprovalStatus != ApprovalStatus.Approved)
                                                              .Select(x => x.Id)
                                                              .ToListAsync();


        if (unapprovedSubscriptionIds.Count == 0) return true;

        var documents = await dataService.SubscriptionDocuments.Where(d => unapprovedSubscriptionIds.Contains(d.SubscriptionId))
                                                               .ToListAsync();

        foreach (var subscriptionId in unapprovedSubscriptionIds)
        {
            if (!documents.Any(d => d.SubscriptionId == subscriptionId && d.DocumentType == DocumentType.SubscriptionPremiumPaymentReceipt)) return false;
        }

        return true;

    }

    private bool Exist(SubmitShareholderApprovalRequestCommand command) => dataService.Shareholders.Any(s => s.Id == command.Id);

    private bool ShouldHaveDraftForApprovalStatus(SubmitShareholderApprovalRequestCommand command) => dataService.Shareholders.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Draft);
}
