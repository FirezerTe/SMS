using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;


namespace SMS.Application.Features.Reports
{
    public class GetShareholderPaymentsReportDataQuery : IRequest<ShareholderPaymentsReportDto>
    {
        public int ShareholderId { get; set; }
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

    public class GetShareHolderAddressQueryHandler :
        IRequestHandler<GetShareholderPaymentsReportDataQuery, ShareholderPaymentsReportDto>
    {
        private readonly IDataService dataService;

        public GetShareHolderAddressQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<ShareholderPaymentsReportDto> Handle(GetShareholderPaymentsReportDataQuery request, CancellationToken cancellationToken)
        {
            var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(sh => sh.Id == request.ShareholderId);
            var paymentsList = await GetShareholderPayments(request);
            var totalPaidInBirr = paymentsList.Sum(pay => pay.PaymentInBirr);
            var totalPaidInShare = paymentsList.Sum(pay => pay.PaymentInShares);
            return new ShareholderPaymentsReportDto
            {
                TotalPaidUpInBirr = totalPaidInBirr,
                TotalPaidUpShares = totalPaidInShare,
                FromDate = request.FromDate.ToString("dd MMMM yyyy"),
                ToDate = request.ToDate.ToString("dd MMMM yyyy"),
                ShareholderId = shareholder.ShareholderNumber,
                ShareholderName = shareholder?.DisplayName,
                Payments = paymentsList
            };
        }
        private async Task<List<ShareholderPaymentDto>> GetShareholderPayments(GetShareholderPaymentsReportDataQuery request)
        {
            var payments = new List<ShareholderPaymentDto>();
            var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(sh => sh.Id == request.ShareholderId);
            var subscriptionsList = await dataService.Subscriptions.Where(sh => sh.ApprovalStatus == ApprovalStatus.Approved).ToListAsync();
            var paymentList = await dataService.Payments.Where(sh => sh.ApprovalStatus == ApprovalStatus.Approved).ToListAsync();
            var parValue = await dataService.ParValues.FirstOrDefaultAsync();
            if (shareholder != null)
            {
                var shareholderSubscriptions = subscriptionsList.Where(sub => sub.ShareholderId == shareholder.Id).ToList();
                foreach (var subscription in shareholderSubscriptions)
                {
                    var shareholderPayments = paymentList.Where(pay => pay.EffectiveDate <= request.ToDate.ToDateTime(TimeOnly.Parse("10:00 PM"))
                    && pay.EffectiveDate >= request.FromDate.ToDateTime(TimeOnly.Parse("10:00 PM")) //&& pay.PaymentTypeEnum != PaymentTypeEnum.TransferPayment 
                    && pay.SubscriptionId == subscription.Id).ToList();

                    foreach (var pay in shareholderPayments)
                    {
                        var shareholderSoldPayments = paymentList.Where(py => py.ParentPaymentId == pay.Id && py.SubscriptionId != pay.SubscriptionId).ToList();

                        if (pay.EndDate != null || (pay.PaymentTypeEnum != PaymentTypeEnum.TransferPayment && pay.EndDate == null))
                        {
                            var payment = new ShareholderPaymentDto
                            {
                                PaymentInBirr = (double)pay.Amount,
                                PaymentInShares = (int)(pay.Amount / parValue.Amount),
                                ReferenceNumber = pay.OriginalReferenceNo,
                                PaYmentType = pay.PaymentTypeEnum.ToString(),
                                PaymentDate = pay.EffectiveDate.ToString().Substring(0, 10),
                                Remark = pay.Note,
                                ReceiptNo = pay.PaymentReceiptNo,
                                PaymentMethod = pay.PaymentMethodEnum.ToString(),
                            };
                            payments.Add(payment);
                        }
                        foreach (var sold in shareholderSoldPayments)
                        {
                            var soldpayment = new ShareholderPaymentDto
                            {
                                PaymentInBirr = (double)sold.Amount * -1,
                                PaymentInShares = (int)(sold.Amount / parValue.Amount) * -1,
                                ReferenceNumber = sold.OriginalReferenceNo,
                                PaYmentType = sold.PaymentTypeEnum.ToString(),
                                PaymentDate = sold.EffectiveDate.ToString().Substring(0, 10),
                                Remark = sold.Note,
                                ReceiptNo = sold.PaymentReceiptNo,
                                PaymentMethod = sold.PaymentMethodEnum.ToString(),
                            };
                            payments.Add(soldpayment);
                        }
                    }
                }
            }
            return payments;
        }
    }
}