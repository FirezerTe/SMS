using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Common.Services.RigsWeb;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetBranchGLPaymentsSummaryQuery : IRequest<BranchPaymentsDetailReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
        public int BusinessUnit { get; set; }
    }

    public class GetBranchGLPaymentsSummaryQueryHandler : IRequestHandler<GetBranchGLPaymentsSummaryQuery, BranchPaymentsDetailReportDto>
    {
        private readonly IDataService dataService;
        private readonly IRigsWebService rigsWebService;
        public GetBranchGLPaymentsSummaryQueryHandler(IDataService dataService, IRigsWebService rigsWebService)
        {
            this.dataService = dataService;
            this.rigsWebService = rigsWebService;
        }
        public async Task<BranchPaymentsDetailReportDto> Handle(GetBranchGLPaymentsSummaryQuery request, CancellationToken cancellationToken)
        {
            var brp = await GetBankAllocationAsync(request);
            var bpTotal = brp.Sum(py => py.Amount);
            return new BranchPaymentsDetailReportDto
            {
                FromDate = request.FromDate,
                ToDate = request.ToDate,
                BusinessUnit = request.BusinessUnit,
                BranchPaymentList = brp,
                branchPaymentTotal = bpTotal,

            };
        }
        private async Task<List<BranchPaymentsDetailDto>> GetBankAllocationAsync(GetBranchGLPaymentsSummaryQuery request)
        {
            var branchPayments = new List<BranchPaymentsDetailDto>();

            var branches = await dataService.Branches.ToListAsync();
            foreach (var br in branches)
            {
                var BranchGLNumber = br.BranchShareGL;
                var result = rigsWebService.GetAccountHistory(BranchGLNumber, request.FromDate.ToString("dd/MM/yyyy"), request.ToDate.ToString("dd/MM/yyyy"));

                if (result.Result != null)
                {
                    decimal branchSumPayment = 0;
                    string BusinessUnitName = "";
                    for (int i = 0; i < result.Result.Count; i++)
                    {
                        branchSumPayment = branchSumPayment + result.Result[i].transactionAmountField;
                        BusinessUnitName = result.Result[i].businessUnitField;
                    }

                    var payments = new BranchPaymentsDetailDto
                    {
                        branchNewShareGL = BranchGLNumber,
                        Amount = branchSumPayment,
                        BusinessUnitName = BusinessUnitName,
                    };
                    branchPayments.Add(payments);
                }
            }
            return branchPayments;
        }
    }
}