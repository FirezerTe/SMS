using Bogus;
using MediatR;


namespace SMS.Application.Features.Reports
{
    public class GetDividendPaymentsReportDataQuery : IRequest<DividendPaymentsReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

    public class GetDividendPaymentsQueryHandler :
        IRequestHandler<GetDividendPaymentsReportDataQuery, DividendPaymentsReportDto>
    {
        private readonly IDataService dataservice;

        public GetDividendPaymentsQueryHandler(IDataService dataservice)
        {
            this.dataservice = dataservice;
        }

        public async Task<DividendPaymentsReportDto> Handle(GetDividendPaymentsReportDataQuery request, CancellationToken cancellationToken)
        {
            return new DividendPaymentsReportDto
            {
                FromDate = request.FromDate.ToString("dd MMMM yyyy"),
                ToDate = request.ToDate.ToString("dd MMMM yyyy"),
                Payments = GetShareholderPayments(request)
            };
        }

        private List<DividendPaymentDto> GetShareholderPayments(GetDividendPaymentsReportDataQuery request)
        {
            var payments = new List<DividendPaymentDto>();
            for (int i = 0; i < 100; i++)
            {
                var payment = new Faker<DividendPaymentDto>()
                    .RuleFor(p => p.ShareholderId, f => f.Random.Number(1, 20000))
                    .RuleFor(p => p.ShareholderName, f => f.Name.FullName())
                    .RuleFor(p => p.PaymentAmount, f => f.Random.Number(1000, 50000))
                    .RuleFor(p => p.PaymentDate, f => f.Date.BetweenDateOnly(request.FromDate, request.ToDate).ToString("dd MMM yyyy"))
                    .RuleFor(p => p.Remark, f => f.Lorem.Sentence(f.Random.Number(1, 5)));

                payments.Add(payment);
            }

            return payments;
        }
    }
}
