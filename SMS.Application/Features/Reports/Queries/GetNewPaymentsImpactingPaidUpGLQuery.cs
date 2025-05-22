using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetNewPaymentsImpactingPaidUpGLQuery : IRequest<PaymentsListReportDto>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public ShareholderStatusEnum? ShareholderStatusEnum { get; set; }

        public int BranchId { get; set; }
    }
    public class GetNewPaymentsImpactingPaidUpGLQueryHandler :
      IRequestHandler<GetNewPaymentsImpactingPaidUpGLQuery, PaymentsListReportDto>
    {
        private readonly IDataService dataService;
        public GetNewPaymentsImpactingPaidUpGLQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<PaymentsListReportDto> Handle(GetNewPaymentsImpactingPaidUpGLQuery request, CancellationToken cancellationToken)
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
        private async Task<List<PaymentsListDto>> GetShareholderPayments(GetNewPaymentsImpactingPaidUpGLQuery request)
        {
            var paymentsList = new List<PaymentsListDto>();
            var payments = new List<Domain.Payment>();
            var shareholdersList = await dataService.Shareholders.ToListAsync();
            var subscriptionsList = await dataService.Subscriptions.Where(sh => sh.ApprovalStatus == ApprovalStatus.Approved).ToListAsync();
            var branch = await dataService.Branches.ToListAsync();
            var paymentList = await dataService.Payments.Where(sh => sh.ApprovalStatus == ApprovalStatus.Approved
            && sh.EffectiveDate <= request.ToDate && sh.EffectiveDate >= request.FromDate && sh.BranchId == request.BranchId).ToListAsync();

            var paymentbranches = paymentList.Select(pl => new { pl.BranchId }).Distinct().ToList();
            if (request.ShareholderStatusEnum == 0)
            {
                payments = paymentList.Where(pay => pay.EffectiveDate <= request.ToDate && pay.EffectiveDate >= request.FromDate && pay.PaymentTypeEnum != PaymentTypeEnum.TransferPayment).ToList();

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
                        var shareholderPayments = paymentList
                                        .Where(pay => pay.EffectiveDate <= request.ToDate &&
                                         pay.EffectiveDate >= request.FromDate &&
                                         pay.SubscriptionId == subscription.Id &&
                                         pay.PaymentTypeEnum != PaymentTypeEnum.TransferPayment)
                                        .ToList();
                        foreach (var payment in shareholderPayments)
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
                var branchInfo = branch.Where(br => br.Id == payment.BranchId).FirstOrDefault();
                var branchName = branchInfo.BranchName;

                var shareholderPayment = new PaymentsListDto()
                {
                    PaymentDate = payment.EffectiveDate.ToString("dd MMMM yyyy"),
                    PaymentAmount = (decimal)payment.Amount,
                    ReceiptNumber = payment.PaymentReceiptNo,
                    PaymentType = payment.PaymentTypeEnum.ToString(),
                    BranchName = branchName,
                    ShareholderId = shareholderInfo.ShareholderNumber,
                    ShareholderName = shareholderName,
                };
                paymentsList.Add(shareholderPayment);
            }
            return paymentsList;
        }
    }
}