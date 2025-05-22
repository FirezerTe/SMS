using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Common.Services.RigsWeb;
using System.Data;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetBranchPaymentReportDataQuery : IRequest<BranchPaymentsDetailReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
        public int BusinessUnit { get; set; }
    }

    public class GetBranchPaymentReportDataQueryHandler : IRequestHandler<GetBranchPaymentReportDataQuery, BranchPaymentsDetailReportDto>
    {
        private readonly IDataService dataService;
        private readonly IRigsWebService rigsWebService;
        public GetBranchPaymentReportDataQueryHandler(IDataService dataService, IRigsWebService rigsWebService)
        {
            this.dataService = dataService;
            this.rigsWebService = rigsWebService;
        }
        public async Task<BranchPaymentsDetailReportDto> Handle(GetBranchPaymentReportDataQuery request, CancellationToken cancellationToken)
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
        private async Task<List<BranchPaymentsDetailDto>> GetBankAllocationAsync(GetBranchPaymentReportDataQuery request)
        {
            var branchPayments = new List<BranchPaymentsDetailDto>();

            var getAccountNumber = await dataService.Branches.Where(a => a.Id == request.BusinessUnit).FirstOrDefaultAsync();

            var BranchGLNumber = getAccountNumber.BranchShareGL;

            var result = rigsWebService.GetAccountHistory(BranchGLNumber, request.FromDate.ToString("dd/MM/yyyy"), request.ToDate.ToString("dd/MM/yyyy"));

            if (result != null)
            {
                for (int i = 0; i < result.Result.Count; i++)
                {
                    var sequence = i + 1;
                    var payments = new BranchPaymentsDetailDto
                    {
                        Sequence = sequence,
                        branchNewShareGL = BranchGLNumber,
                        Amount = result.Result[i].transactionAmountField,
                        BusinessUnitName = result.Result[i].businessUnitField,
                        TransactionReferenceNumber = result.Result[i].transactionIdField,
                        TransactionDate = result.Result[i].transactionDateField.Substring(0, 10),
                    };
                    branchPayments.Add(payments);
                }
            }
            return branchPayments;
        }
    }
}