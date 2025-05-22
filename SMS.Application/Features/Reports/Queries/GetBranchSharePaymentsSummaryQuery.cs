using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetBranchSharePaymentsSummaryQuery : IRequest<PaymentsListReportDto>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public ShareholderStatusEnum? ShareholderStatusEnum { get; set; }

        public int BranchId { get; set; }
    }
    public class GetBranchSharePaymentsSummaryQueryHandler :
      IRequestHandler<GetBranchSharePaymentsSummaryQuery, PaymentsListReportDto>
    {
        private readonly IDataService dataService;
        public GetBranchSharePaymentsSummaryQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<PaymentsListReportDto> Handle(GetBranchSharePaymentsSummaryQuery request, CancellationToken cancellationToken)
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
        private async Task<List<PaymentsListDto>> GetShareholderPayments(GetBranchSharePaymentsSummaryQuery request)
        {
            var paymentsList = new List<PaymentsListDto>();
            var payments = new List<Domain.Payment>();
            var branch = await dataService.Branches.ToListAsync();
            var paymentList = await dataService.Payments.Where(sh => sh.ApprovalStatus == ApprovalStatus.Approved
            && sh.EffectiveDate <= request.ToDate && sh.EffectiveDate >= request.FromDate).ToListAsync();


            foreach (var br in branch)
            {
                decimal branchTotal = 0;

                payments = paymentList.Where(pay => pay.BranchId == br.Id).ToList();
                foreach (var payment in payments)
                {
                    branchTotal = Math.Round(branchTotal + (decimal)payment.Amount, 2);
                }
                if (payments.Count > 0)
                {
                    var shareholderPayment = new PaymentsListDto()
                    {
                        branchNewShareGL = br.BranchShareGL,
                        PaymentAmount = branchTotal,
                        BranchName = br.BranchName,
                    };
                    paymentsList.Add(shareholderPayment);
                }
            }


            return paymentsList;
        }
    }
}