using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Notification;
using SMS.Application.Features.Notification.Commands;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;


[Authorize(Policy = AuthPolicy.CanApproveShareholder)]
public record ApproveShareholderCommand(int Id, string Note) : IRequest;

public class ApproveShareholderCommandHandler : IRequestHandler<ApproveShareholderCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;
    private readonly IMediator mediator;
    private readonly IShareholderSummaryService shareholderSummaryService;
    private readonly IParValueService parValueService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;
    private readonly IBackgroundJobScheduler backgroundJobService;
    public ApproveShareholderCommandHandler(
        IDataService dataService,
        IUserService userService,
        IMediator mediator,
        IShareholderSummaryService shareholderSummaryService,
        IParValueService parValueService,
        IShareholderChangeLogService shareholderChangeLogService,
        IBackgroundJobScheduler backgroundJobService)
    {
        this.dataService = dataService;
        this.userService = userService;
        this.mediator = mediator;
        this.shareholderSummaryService = shareholderSummaryService;
        this.parValueService = parValueService;
        this.shareholderChangeLogService = shareholderChangeLogService;
        this.backgroundJobService = backgroundJobService;
    }
    public async Task Handle(ApproveShareholderCommand request, CancellationToken cancellationToken)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(x => x.Id == request.Id);

        if (shareholder != null)
        {
            shareholder.ApprovalStatus = ApprovalStatus.Approved;

            //Approve related entities
            var shareholdersInvolved = await ApproveTransfers(request);
            await ApproveContactChanges(request);
            await ApproveBlockedStatusChanges(request);
            await ApproveSubscriptionChanges(request);
            await ApproveSubscriptionPaymentChanges(request);
            await ApproveCertificateChanges(request);
            await ApproveDividendDecisionChanges(request);
            await dataService.SaveAsync(cancellationToken);
            await mediator.Send(new AddShareholderCommentCommand(request.Id, CommentType.Approval, request.Note));

            await shareholderSummaryService.ComputeShareholderSummaries(request.Id, true, cancellationToken);
            foreach (var shareholderId in shareholdersInvolved)
            {
                await shareholderSummaryService.ComputeShareholderSummaries(shareholderId, true, cancellationToken);
            }

            await shareholderChangeLogService.Clear(request.Id, cancellationToken);
        }
    }
    private async Task ApproveDividendDecisionChanges(ApproveShareholderCommand request)
    {
        var dividends = await dataService.DividendDecisions.Where(d => d.Dividend.ShareholderId == request.Id && d.ApprovalStatus == ApprovalStatus.Submitted)
                                                           .Include(d => d.Dividend.DividendSetup)
                                                           .ToListAsync();
        var decisionId = dividends.Select(a => a.Id).ToList();
        foreach (var dividend in dividends)
            dividend.ApprovalStatus = ApprovalStatus.Approved;
        if (dividends.Count > 0)
        {
            var capitalizeAmountTotal = dividends.Sum(dv => dv.CapitalizedAmount);
            var fulfilemtAmountTotal = dividends.Sum(dv => dv.FulfillmentPayment);
            var totalCapitalizeAmount = fulfilemtAmountTotal + capitalizeAmountTotal;
            var currentYearDividend = dividends.OrderByDescending(dv => dv.Id).FirstOrDefault();

            if (totalCapitalizeAmount > 0)
            {
                await DividendCapitalization(currentYearDividend, totalCapitalizeAmount, request);
            }

            backgroundJobService.EnqueueDividendDecisionCompute(decisionId);
        }
    }
    private async Task DividendCapitalization(DividendDecision dividendDecision, decimal totalCapitalizeAmount, ApproveShareholderCommand request)
    {
        var dividendPeriod = dataService.DividendPeriods.Where(div => div.Id == dividendDecision.Dividend.DividendSetup.DividendPeriodId).FirstOrDefault();
        var loggedInUserId = userService.GetCurrentUserId();
        var subscriptionGroup = dataService.SubscriptionGroups.Where(sub => sub.IsDividendCapitalization == true).FirstOrDefault();
        var today = DateTime.Now.Date;

        if (dividendDecision != null)
        {
            var subscription = new Subscription()
            {
                Amount = totalCapitalizeAmount,
                SubscriptionGroupID = subscriptionGroup.Id,
                SubscriptionDate = (DateTime)(dividendDecision.DecisionDate?.ToDateTime(TimeOnly.Parse("12:00 AM"))),
                ShareholderId = dividendDecision.Dividend.ShareholderId,
                SubscriptionPaymentDueDate = DateOnly.FromDateTime(today),
                SubscriptionBranchID = dividendDecision.BranchId,
                SubscriptionDistrictID = dividendDecision.DistrictId,
                DividendDescisionId = dividendDecision.Id,
                SubscriptionType = SubscriptionTypeEnum.DividendCapitalize,
                ApprovalStatus = ApprovalStatus.Approved,
                SkipStateTransitionCheck = true
            };


            var payment = new Payment
            {
                Amount = totalCapitalizeAmount,
                EffectiveDate = (DateTime)(dividendDecision.DecisionDate?.ToDateTime(TimeOnly.Parse("12:00 AM"))),
                SubscriptionId = subscription.Id,
                PaymentTypeEnum = PaymentTypeEnum.DividendCapitalize,
                PaymentMethodEnum = PaymentMethodEnum.DividendCapitalization,
                BranchId = dividendDecision.BranchId,
                DistrictId = dividendDecision.DistrictId,
                Note = $"Dividend captalized on Fiscal Year - {dividendPeriod.Year} ",
                Subscription = subscription,
                ApprovalStatus = ApprovalStatus.Approved,
                ApprovedBy = loggedInUserId,
                SkipStateTransitionCheck = true,

            };

            dataService.Subscriptions.Add(subscription);
            dataService.Payments.Add(payment);

            dividendDecision.SkipStateTransitionCheck = true;
            await SendSMSTextMessage(request, SMSType.DividendCaptalize, totalCapitalizeAmount, dividendPeriod.Year, null);
        }
    }
    private async Task ApproveCertificateChanges(ApproveShareholderCommand request)
    {
        var certificates = await dataService.Certficates
            .Where(certificate => certificate.ApprovalStatus != ApprovalStatus.Approved && certificate.ShareholderId == request.Id)
            .ToListAsync();

        foreach (var certificate in certificates)
            certificate.ApprovalStatus = ApprovalStatus.Approved;

    }

    public async Task<List<int>> ApproveTransfers(ApproveShareholderCommand request)
    {
        var transfers = await dataService.Transfers.Where(t => t.ApprovalStatus == ApprovalStatus.Submitted && t.FromShareholderId == request.Id).ToListAsync();
        var involvedShareholderIds = new List<int>();
        foreach (var transfer in transfers)
        {
            var shareholderIds = await ApproveTransfer(transfer, request);
            involvedShareholderIds.AddRange(shareholderIds);
        }

        return involvedShareholderIds;
    }

    private async Task<List<int>> ApproveTransfer(Transfer transfer, ApproveShareholderCommand request)
    {
        var loggedInUserId = userService.GetCurrentUserId();

        var involvedShareholderIds = new List<int> { transfer.FromShareholderId };
        involvedShareholderIds.AddRange(transfer.Transferees.Select(x => x.ShareholderId));

        var involvedShareholders = await dataService.Shareholders.Where(s => involvedShareholderIds.Contains(s.Id)).ToListAsync();

        var affectedPaymentIds = transfer.Transferees.SelectMany(t => t.Payments).Select(p => p.PaymentId).Distinct().ToList();
        var affectedPayments = await dataService.Payments.Include(x => x.Subscription).Include(x => x.Shares).Where(p => affectedPaymentIds.Contains(p.Id)).ToListAsync();

        var transferer = involvedShareholders.FirstOrDefault(t => transfer.FromShareholderId == t.Id);

        if (transferer == null)
        {
            throw new Exception("Unable to find transferer");

        }
        var suffix = $"{transferer.DisplayName}(ID: {transferer.Id}) {transfer.EffectiveDate.ToString("yyyy-MM-dd")}";

        var affectedShares = affectedPayments.SelectMany(p => p.Shares).ToList() ?? new List<Share>();

        foreach (var payment in affectedPayments)
        {
            payment.EndDate = transfer.EffectiveDate.ToDateTime(TimeOnly.Parse("00:00"));
            payment.ApprovalStatus = ApprovalStatus.Approved;
            payment.SkipStateTransitionCheck = true;

            var transferredAmount = transfer.Transferees.SelectMany(t => t.Payments).Where(t => t.PaymentId == payment.Id).Sum(p => p.Amount);

            var remainingAmount = payment.Amount - transferredAmount;

            if (remainingAmount < 0)
            {
                throw new Exception("Cannot transfer more than paid amount");
            }

            payment.Subscription.Amount -= transferredAmount;
            payment.Subscription.SkipStateTransitionCheck = true;

            if (remainingAmount > 0)
            {
                var paymentForRemaining = new Payment
                {
                    Amount = remainingAmount,
                    EffectiveDate = transfer.EffectiveDate.ToDateTime(TimeOnly.Parse("00:00")),
                    ParentPaymentId = payment.Id,
                    OriginalReferenceNo = payment.OriginalReferenceNo,
                    PaymentReceiptNo = payment.PaymentReceiptNo,
                    SubscriptionId = payment.SubscriptionId,
                    PaymentTypeEnum = PaymentTypeEnum.TransferPayment,
                    PaymentMethodEnum = PaymentMethodEnum.Transfer,
                    ForeignCurrencyId = payment.ForeignCurrencyId,
                    ForeignCurrencyAmount = payment.ForeignCurrencyAmount,
                    BranchId = payment.BranchId,
                    DistrictId = payment.DistrictId,
                    Note = $"Remainder from transfer - {suffix} \n\n {payment.Note ?? ""}",
                    ApprovalStatus = ApprovalStatus.Approved,
                    ApprovedBy = loggedInUserId,
                    SkipStateTransitionCheck = true,

                };


                var shares = affectedShares.Where(s => s.PaymentId == payment.Id);

                decimal shareTransferred = 0;
                foreach (var share in shares)
                {
                    if (shareTransferred < remainingAmount)
                    {
                        share.Payment = paymentForRemaining;
                        shareTransferred += share.ParValue;
                    }
                    else
                        break;
                }


                dataService.Payments.Add(paymentForRemaining);
            }
        }
        await SendSMSTextMessage(request, SMSType.Transferor, transfer.TotalTransferAmount, transfer.AgreementDate.ToString(), null);
        foreach (var transferee in transfer.Transferees)
        {
            //create subscription per allocation
            var fromPayments = affectedPayments.Where(ap => transferee.Payments.Any(p => p.PaymentId == ap.Id));

            var paymentsPerSubscriptionGroup = fromPayments.GroupBy(p => p.Subscription.SubscriptionGroupID);

            var shareholderInformation = await dataService.Shareholders.Where(sh => sh.Id == transferee.ShareholderId).FirstOrDefaultAsync();

            foreach (var group in paymentsPerSubscriptionGroup)
            {
                var subscriptionGroup = group.Key;
                var paymentsFromGroup = transferee.Payments.Where(p => fromPayments.Any(fp => fp.Id == p.PaymentId && fp.Subscription.SubscriptionGroupID == group.Key));
                var totalTransferredFromGroup = paymentsFromGroup.Sum(x => x.Amount);

                var today = DateTime.Today;


                var subscription = new Subscription()
                {
                    Amount = totalTransferredFromGroup,
                    SubscriptionGroupID = group.Key,
                    SubscriptionDate = today,
                    SubscriptionPaymentDueDate = DateOnly.FromDateTime(today),
                    ShareholderId = transferee.ShareholderId,
                    SubscriptionBranchID = transfer.BranchId,
                    SubscriptionDistrictID = transfer.DistrictId,
                    SubscriptionType = SubscriptionTypeEnum.Transfer,
                    ApprovalStatus = ApprovalStatus.Approved,
                    SkipStateTransitionCheck = true
                };

                var payments = paymentsFromGroup.Select(p => new Payment
                {
                    Amount = p.Amount,
                    EffectiveDate = transfer.EffectiveDate.ToDateTime(TimeOnly.Parse("00:00")),
                    PaymentTypeEnum = PaymentTypeEnum.TransferPayment,
                    PaymentMethodEnum = PaymentMethodEnum.Transfer,
                    ParentPaymentId = p.PaymentId,
                    BranchId = transfer.BranchId,
                    DistrictId = transfer.DistrictId,
                    OriginalReferenceNo = fromPayments.FirstOrDefault(x => x.Id == p.PaymentId)?.OriginalReferenceNo,
                    PaymentReceiptNo = fromPayments.FirstOrDefault(x => x.Id == p.PaymentId)?.PaymentReceiptNo,
                    ForeignCurrencyId = fromPayments.FirstOrDefault(x => x.Id == p.PaymentId)?.ForeignCurrencyId,
                    ForeignCurrencyAmount = fromPayments.FirstOrDefault(x => x.Id == p.PaymentId)?.ForeignCurrencyAmount,
                    Subscription = subscription,
                    // Transfer = transfer,
                    ApprovalStatus = ApprovalStatus.Approved,
                    Note = $"Transfer from {suffix}",
                    SkipStateTransitionCheck = true,

                }).ToList();


                foreach (var payment in payments)
                {
                    var shares = affectedShares.Where(s => s.Payment != null && s.Payment.Id == payment.ParentPaymentId).ToList();
                    decimal shareTransferred = 0;
                    foreach (var share in shares)
                    {
                        if (shareTransferred < payment.Amount)
                        {
                            share.Payment = payment;
                            shareTransferred += share.ParValue;
                        }
                        else
                            break;
                    }
                }

                dataService.Payments.AddRange(payments);
                dataService.Subscriptions.Add(subscription);
            }

            transfer.ApprovalStatus = ApprovalStatus.Approved;
            transfer.SkipStateTransitionCheck = true;
            await SendSMSTextMessage(request, SMSType.Transferee, transferee.Amount, transfer.AgreementDate.ToString(), shareholderInformation);
        }
        return involvedShareholderIds;
    }



    private async Task<List<int>> ApproveSubscriptionChanges(ApproveShareholderCommand request)
    {
        var subscriptionsToApprove = await dataService.Subscriptions
           .Where(c => c.ApprovalStatus != ApprovalStatus.Approved && c.ShareholderId == request.Id)
           .ToListAsync();

        foreach (var subscription in subscriptionsToApprove)
        {
            subscription.ApprovalStatus = ApprovalStatus.Approved;
        }

        return subscriptionsToApprove.Select(x => x.Id).ToList();
    }

    private async Task ApproveContactChanges(ApproveShareholderCommand request)
    {
        var contactsToApprove = await dataService.Contacts
            .Where(c => c.ShareholderId == request.Id && c.ApprovalStatus != ApprovalStatus.Approved)
            .ToListAsync();

        foreach (var contact in contactsToApprove)
            contact.ApprovalStatus = ApprovalStatus.Approved;
    }

    private async Task ApproveBlockedStatusChanges(ApproveShareholderCommand request)
    {
        var blockedStatuses = await dataService.BlockedShareholders
            .Where(blockedStatus => blockedStatus.ShareholderId == request.Id &&
                    blockedStatus.ApprovalStatus != ApprovalStatus.Approved)
            .ToListAsync();
        var shareholderInfo = await dataService.Shareholders.Where(sh => sh.Id == request.Id).FirstOrDefaultAsync();
        foreach (var blocked in blockedStatuses)
        {
            blocked.ApprovalStatus = ApprovalStatus.Approved;
            if (shareholderInfo.IsBlocked == true && shareholderInfo.ShareholderStatus == ShareholderStatusEnum.Blocked)
            {
                await SendSMSTextMessage(request, SMSType.ShareBlocking, (decimal)blocked.Amount, null, null);
            }
            else
            {
                await SendSMSTextMessage(request, SMSType.ShareUnblocking, (decimal)blocked.Amount, null, null);
            }
        }
    }

    private async Task<List<int>> ApproveSubscriptionPaymentChanges(ApproveShareholderCommand request)
    {
        var payments = await dataService.Payments
            .Where(payment => payment.ApprovalStatus != ApprovalStatus.Approved && payment.Subscription.ShareholderId == request.Id)
            .ToListAsync();

        var currentParValueAmount = (await parValueService.GetCurrentParValue())?.Amount ?? 0;

        var totalNewPaymentsAmount = payments.Where(p => p.Amount > 0).Sum(p => p.Amount);

        var sharesCount = Math.Ceiling(totalNewPaymentsAmount / currentParValueAmount);

        var newShares = await dataService.Shares.Where(s => s.PaymentId == null && s.ParValue == currentParValueAmount)
                                                       .OrderBy(x => x.SerialNumber)
                                                       .Take((int)sharesCount)
                                                       .ToListAsync();


        foreach (var payment in payments)
        {
            var hasApprovedPayment = await dataService.Payments.AnyAsync(s => s.Subscription.ShareholderId == request.Id && s.ApprovalStatus == ApprovalStatus.Approved);
            payment.ApprovalStatus = ApprovalStatus.Approved;
            if (payment.Amount > 0)
            {
                var recordedShares = await dataService.Shares.Where(s => s.PaymentId == payment.Id).SumAsync(x => x.ParValue);
                var diff = payment.Amount - recordedShares;
                if (diff > 0)
                {
                    var paymentSharesCount = Math.Ceiling(diff / currentParValueAmount);
                    var shares = newShares.Where(s => s.PaymentId == null)
                                          .OrderBy(x => x.SerialNumber)
                                          .Take((int)paymentSharesCount)
                                          .ToList();

                    foreach (var share in shares)
                        share.PaymentId = payment.Id;
                }
            }
            else if (payment.Amount < 0)
            {
                var parentShares = await dataService.Shares.Where(s => s.PaymentId == payment.ParentPaymentId)
                                                           .OrderByDescending(x => x.SerialNumber)
                                                           .ToListAsync();
                decimal totalRemoved = 0;
                foreach (var share in parentShares)
                {
                    if (totalRemoved + share.ParValue <= Math.Abs(payment.Amount))
                    {
                        share.PaymentId = null;
                        totalRemoved += share.ParValue;

                    }
                    else
                        break;
                }
            }
            if (hasApprovedPayment == false)
            {
                await SendSMSTextMessage(request, SMSType.FirstTimePayment, payment.Amount, null, null);
            }
            else
            {
                await SendSMSTextMessage(request, SMSType.PaymentMade, payment.Amount, null, null);
            }
        }


        return payments.Where(p => p != null).Select(p => p.Id).ToList();
    }
    private async Task<bool> SendSMSTextMessage(ApproveShareholderCommand request, SMSType smstype, decimal txnAmount, string Date, Shareholder shareholderInfo)
    {
        var shareholderInformation = dataService.Shareholders.Where(sh => sh.Id == request.Id).FirstOrDefault();
        var shareholderContact = dataService.Contacts
                                            .Where(con => con.ShareholderId == request.Id && con.Type == ContactType.CellPhone)
                                            .OrderByDescending(con => con.CreatedAt)
                                            .FirstOrDefault();
        var currentParValueAmount = (await parValueService.GetCurrentParValue())?.Amount ?? 0;
        if (shareholderContact != null)
        {
            var shareholderSubscriptions = await dataService.Subscriptions.Where(sub => sub.ShareholderId == request.Id && sub.ApprovalStatus == ApprovalStatus.Approved).Include(sh => sh.Payments).ToListAsync();
            var shareholderPaidup = new decimal(0);
            var shareholderSubscriptionAmount = shareholderSubscriptions.Sum(sub => sub.Amount);
            foreach (var pay in shareholderSubscriptions)
            {
                var availablePayments = pay.Payments.Where(pay => pay.EndDate == null).ToList();
                shareholderPaidup = shareholderPaidup + availablePayments.Sum(pay => pay.Amount);
            }

            if (smstype == SMSType.FirstTimePayment)
            {
                await mediator.Send(new CreateSMSNotificationCommand()
                {

                    Notification = new SMSNotification()
                    {
                        AlertId = shareholderInformation.Name,
                        MobileNumber = shareholderContact?.Value,
                        SMSType = SMSType.FirstTimePayment,
                        Model = new
                        {
                            Name = $"{shareholderInformation.DisplayName} ",
                            ShareholderNumber = $"{shareholderInformation.ShareholderNumber} ",
                            shares = Math.Round(txnAmount / currentParValueAmount, 2),
                            paidupamount = Math.Round(shareholderPaidup + txnAmount, 2),

                        }
                    }
                });
            }
            else if (smstype == SMSType.PaymentMade)
            {
                await mediator.Send(new CreateSMSNotificationCommand()
                {

                    Notification = new SMSNotification()
                    {
                        AlertId = shareholderInformation.Name,
                        MobileNumber = shareholderContact?.Value,
                        SMSType = SMSType.PaymentMade,
                        Model = new
                        {
                            Name = $"{shareholderInformation.DisplayName} ",
                            ShareholderNumber = $"{shareholderInformation.ShareholderNumber} ",
                            shares = Math.Round(txnAmount / currentParValueAmount, 2),
                            paidupamount = Math.Round(shareholderPaidup, 2),

                        }
                    }
                });
            }
            else if (smstype == SMSType.Transferor)
            {
                await mediator.Send(new CreateSMSNotificationCommand()
                {

                    Notification = new SMSNotification()
                    {
                        AlertId = shareholderInformation.Name,
                        MobileNumber = shareholderContact?.Value,
                        SMSType = SMSType.Transferor,
                        Model = new
                        {
                            Name = $"{shareholderInformation.DisplayName} ",
                            shares = Math.Round(txnAmount / currentParValueAmount, 2),
                            TransactionAmount = Math.Round(txnAmount, 2),
                            TransferDate = Date,
                            paidupamount = Math.Round(shareholderPaidup, 2),
                        }
                    }
                });
            }
            else if (smstype == SMSType.Transferee)
            {
                var transfereePaidupInformation = dataService.ShareholderSubscriptionsSummaries.Where(sh => sh.ShareholderId == shareholderInfo.Id).FirstOrDefault();
                await mediator.Send(new CreateSMSNotificationCommand()
                {

                    Notification = new SMSNotification()
                    {
                        AlertId = shareholderInformation.Name,
                        MobileNumber = shareholderContact?.Value,
                        SMSType = SMSType.Transferee,
                        Model = new
                        {
                            Name = $"{shareholderInfo.DisplayName} ",
                            shares = Math.Round(txnAmount / currentParValueAmount, 2),
                            TransactionAmount = Math.Round(txnAmount, 2),
                            TransferDate = Date,
                            TransferorName = shareholderInformation.DisplayName,
                            paidupamount = Math.Round(transfereePaidupInformation.ApprovedPaymentsAmount + txnAmount, 2),
                            ShareholderNumber = $"{shareholderInformation.ShareholderNumber} ",
                        }
                    }
                });
            }
            else if (smstype == SMSType.DividendCaptalize)
            {
                await mediator.Send(new CreateSMSNotificationCommand()
                {

                    Notification = new SMSNotification()
                    {
                        AlertId = shareholderInformation.Name,
                        MobileNumber = shareholderContact?.Value,
                        SMSType = smstype,
                        Model = new
                        {
                            Name = $"{shareholderInformation.DisplayName} ",
                            ShareholderNumber = $"{shareholderInformation.ShareholderNumber} ",
                            paidupamount = Math.Round(shareholderPaidup + txnAmount, 2),
                            FiscalYear = Math.Round(txnAmount, 2),

                        }
                    }
                });
            }
            else if (smstype == SMSType.ShareBlocking)
            {
                await mediator.Send(new CreateSMSNotificationCommand()
                {

                    Notification = new SMSNotification()
                    {
                        AlertId = shareholderInformation.Name,
                        MobileNumber = shareholderContact?.Value,
                        SMSType = smstype,
                        Model = new
                        {
                            Name = $"{shareholderInformation.DisplayName} ",
                            paidupamount = Math.Round(shareholderPaidup - txnAmount, 2),
                            TransactionAmount = Math.Round(txnAmount, 2),
                            shares = Math.Round(txnAmount / currentParValueAmount, 2),
                        }
                    }
                });
            }
            else
            {
                await mediator.Send(new CreateSMSNotificationCommand()
                {

                    Notification = new SMSNotification()
                    {
                        AlertId = shareholderInformation.Name,
                        MobileNumber = shareholderContact?.Value,
                        SMSType = smstype,
                        Model = new
                        {
                            Name = $"{shareholderInformation.DisplayName} ",
                            paidupamount = Math.Round(shareholderPaidup , 2),
                            TransactionAmount = Math.Round(txnAmount, 2),
                            shares = Math.Round(txnAmount / currentParValueAmount, 2),
                        }
                    }
                });
            }
        }

        return true;

    }
}