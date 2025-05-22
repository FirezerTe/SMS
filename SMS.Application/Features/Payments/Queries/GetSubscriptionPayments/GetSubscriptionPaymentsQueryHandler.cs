using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public record SubscriptionPayments(
   List<SubscriptionPaymentDto>? Approved,
   List<SubscriptionPaymentDto>? Submitted,
   List<SubscriptionPaymentDto>? Rejected,
   List<SubscriptionPaymentDto>? Draft);

public record GetSubscriptionPaymentsQuery(int SubscriptionId) : IRequest<SubscriptionPayments>;

public class GetSubscriptionPaymentsQueryHandler
    : IRequestHandler<GetSubscriptionPaymentsQuery, SubscriptionPayments>
{
    private readonly IDataService dataService;
    private readonly IDividendService dividendService;
    private readonly IMapper mapper;

    public GetSubscriptionPaymentsQueryHandler(IDataService dataService, IDividendService dividendService, IMapper mapper)
    {
        this.dataService = dataService;
        this.dividendService = dividendService;
        this.mapper = mapper;
    }
    public async Task<SubscriptionPayments> Handle(GetSubscriptionPaymentsQuery request, CancellationToken cancellationToken)
    {
        var payments = await dataService.Payments.TemporalAll()
            .Where(p => p.SubscriptionId == request.SubscriptionId)
            .OrderByDescending(p => p.EffectiveDate)
            .ThenByDescending(p => p.CreatedAt)
            .ProjectTo<SubscriptionPaymentDto>(mapper.ConfigurationProvider)
            .ToListAsync();

        var paymentIds = payments.Select(p => p.Id).Distinct().ToList();

        var childrenCount = await dataService.Payments.Where(p => p.ParentPaymentId != null && paymentIds.Contains(p.ParentPaymentId ?? 0))
                                                                     .GroupBy(p => p.ParentPaymentId)
                                                                     .ToDictionaryAsync(grp => grp.Key ?? 0, g => g.Count() > 0);


        foreach (var payment in payments)
        {
            var hasChild = false;
            childrenCount.TryGetValue(payment.Id, out hasChild);
            payment.HasChildPayment = hasChild;
        }

        var receipts = await dataService.PaymentReceipts
            .ProjectTo<SubscriptionPaymentReceiptDto>(mapper.ConfigurationProvider)
            .Where(r => paymentIds.Contains(r.PaymentId)).ToListAsync();

        var currentDividendPeriod = await dividendService.GetCurrentDividendPeriod();

        foreach (var payment in payments)
        {

            payment.Receipts = receipts.Where(r => r.PaymentId == payment.Id).ToList();

            payment.IsReadOnly = currentDividendPeriod == null || DateOnly.FromDateTime(payment.EffectiveDate) < currentDividendPeriod.StartDate;
        }

        var draft = payments
            .Where(s => s.ApprovalStatus == ApprovalStatus.Draft &&
            s.PeriodEnd > DateTime.UtcNow).ToList();

        var submitted = payments
            .Where(s => s.ApprovalStatus == ApprovalStatus.Submitted &&
            s.PeriodEnd > DateTime.UtcNow).ToList();

        var approved = payments
            .Where(s => s.ApprovalStatus == ApprovalStatus.Approved)
            .OrderByDescending(s => s.PeriodStart)
            .GroupBy(s => new { s.Id })
            .Select(grp => grp.FirstOrDefault())
            .Where(p => p != null).ToList();

        var rejected = payments
            .Where(p => p.ApprovalStatus == ApprovalStatus.Rejected &&
            (
                !approved.Any(approvedPayment => approvedPayment?.Id == p.Id) ||
                !approved.Any(approvedPayment => approvedPayment?.Id == p.Id && approvedPayment.PeriodStart > p.PeriodEnd))
            )
            .ToList();

        if (approved?.Count() > 0)
        {
            var unApproved = new List<SubscriptionPaymentDto>().Union(draft).Union(submitted).Union(rejected);

            foreach (var approvedPayment in approved)
            {
                if (approvedPayment != null)
                {
                    approvedPayment.UnapprovedTransfers = unApproved.Where(u => u.PaymentTypeEnum == PaymentTypeEnum.TransferPayment && u.ParentPaymentId == approvedPayment.Id).ToList();
                    approvedPayment.UnapprovedAdjustments = unApproved.Where(u => (u.PaymentTypeEnum == PaymentTypeEnum.Reversal || u.PaymentTypeEnum == PaymentTypeEnum.Correction) && u.ParentPaymentId == approvedPayment.Id).ToList();

                    foreach (var transfer in approvedPayment.UnapprovedTransfers)
                        transfer.ParentPayment = approvedPayment;

                    foreach (var adjustment in approvedPayment.UnapprovedAdjustments)
                        adjustment.ParentPayment = approvedPayment;
                }
            }
        }

        return new SubscriptionPayments(
            Approved: approved,
            Submitted: submitted,
            Rejected: rejected,
            Draft: draft);
    }
}
