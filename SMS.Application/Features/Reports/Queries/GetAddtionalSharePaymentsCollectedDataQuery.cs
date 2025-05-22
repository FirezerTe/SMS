using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetAddtionalSharePaymentsCollectedDataQuery : IRequest<PaymentsListReportDto>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public ShareholderStatusEnum? ShareholderStatusEnum { get; set; }
    }
    public class GetAddtionalSharePaymentsCollectedDataQueryHandler :
      IRequestHandler<GetAddtionalSharePaymentsCollectedDataQuery, PaymentsListReportDto>
    {
        private readonly IDataService dataService;
        public GetAddtionalSharePaymentsCollectedDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<PaymentsListReportDto> Handle(GetAddtionalSharePaymentsCollectedDataQuery request, CancellationToken cancellationToken)
        {
            var paymentsList = await GetShareholderPayments(request);
            var totalPaymentAmount = paymentsList.Sum(payment => payment.PaymentAmount);
            return new PaymentsListReportDto
            {
                FromDate = request.FromDate.ToString("dd MMMM yyyy"),
                ToDate = request.ToDate.ToString("dd MMMM yyyy"),
                Payments = paymentsList,
                TotalPaymentAmount = totalPaymentAmount
            };
        }
        private async Task<List<PaymentsListDto>> GetShareholderPayments(GetAddtionalSharePaymentsCollectedDataQuery request)
        {
            var paymentsList = new List<PaymentsListDto>();
            var payments = new List<Domain.Payment>();
            var shareholdersList = await dataService.Shareholders.ToListAsync();
            var subscriptionsList = await dataService.Subscriptions.Where(sh => sh.ApprovalStatus == ApprovalStatus.Approved).ToListAsync();
            var paymentList = await dataService.Payments.Where(sh => sh.ApprovalStatus == ApprovalStatus.Approved).ToListAsync();
            if (request.ShareholderStatusEnum == 0)
            {
                payments = paymentList.Where(pay => pay.EffectiveDate <= request.ToDate && pay.EffectiveDate >= request.FromDate && pay.PaymentTypeEnum == PaymentTypeEnum.TransferPayment).ToList();

            }
            else
            {
                bool newShareholder;
                if (request.ShareholderStatusEnum == ShareholderStatusEnum.New)
                {
                    newShareholder = true;
                }
                else
                {
                    newShareholder = false;
                }
                var shareholdersListByStatus = shareholdersList.Where(shareholder => shareholder.IsNew == newShareholder).ToList();
                foreach (var shareholder in shareholdersListByStatus)
                {
                    var shareholderSubscriptions = subscriptionsList.Where(sub => sub.ShareholderId == shareholder.Id).ToList();
                    foreach (var subscription in shareholderSubscriptions)
                    {
                        var shareholderAddtionalPayments = paymentList
                                        .Where(pay => pay.EffectiveDate <= request.ToDate &&
                                         pay.EffectiveDate >= request.FromDate &&
                                         pay.PaymentTypeEnum != PaymentTypeEnum.TransferPayment)
                                        .ToList();
                        foreach (var payment in shareholderAddtionalPayments)
                        {
                            payments.Add(payment);
                        }
                    }
                }
            }
            foreach (var payment in payments)
            {
                var subscriptionInfo = subscriptionsList.Where(sub => sub.Id == payment.SubscriptionId).FirstOrDefault();
                var subscriptionId = subscriptionInfo.Id;
                var subscriptionDescription = subscriptionInfo.WorkflowComment;
                var shareholderId = subscriptionInfo.ShareholderId;
                var shareholderInfo = shareholdersList.Where(sh => sh.Id == shareholderId).FirstOrDefault();
                var shareholderName = shareholderInfo.DisplayName;

                var shareholderPayment = new PaymentsListDto()
                {
                    PaymentDate = payment.EffectiveDate.ToString(),
                    PaymentAmount = (decimal)payment.Amount,
                    ReceiptNumber = payment.PaymentReceiptNo,
                    SubscriptionInfo = "Ref No=" + subscriptionInfo.SubscriptionOriginalReferenceNo,
                    PaymentType = payment.PaymentTypeEnum.ToString(),
                    ShareholderId = shareholderInfo.ShareholderNumber,
                    ShareholderName = shareholderName,
                };
                paymentsList.Add(shareholderPayment);
            }
            return paymentsList;
        }
    }
}