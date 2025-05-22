using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;

namespace SMS.Application.Features.Reports
{
    public class GetPaidupBalanceReportDataQuery : IRequest<PaidUpSummeryByShareholderDtoReportDto>
    {
        public DateTime ToDate { get; set; }
    }
    public class GetPaidupBalanceReportDataQueryHandler :
        IRequestHandler<GetPaidupBalanceReportDataQuery, PaidUpSummeryByShareholderDtoReportDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetPaidupBalanceReportDataQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<PaidUpSummeryByShareholderDtoReportDto> Handle(GetPaidupBalanceReportDataQuery request, CancellationToken cancellationToken)
        {
            var paymentsList = await GetPaidups(request);
            var totalPaymentAmount = paymentsList.Sum(payment => payment.TotalPayments);
            return new PaidUpSummeryByShareholderDtoReportDto
            {
                ToDate = request.ToDate.ToString("dd MMMM yyyy"),
                PaymentsTotal = paymentsList,
                TotalPaymentAmount = totalPaymentAmount
            };
        }
        private async Task<List<PaidUpSummeryByShareholderDto>> GetPaidups(GetPaidupBalanceReportDataQuery request)
        {
            var shareholderPaidupList = new List<PaidUpSummeryByShareholderDto>();
            var toDate = request.ToDate.AddDays(1);
            var shareholderList = await dataService.Shareholders.ToListAsync();
            var shareholderSubscriptionSummeryList = await dataService.ShareholderSubscriptionsSummaries
                                                                    .TemporalAsOf(toDate)
                                                                    .ToListAsync();
            var parvalueInfo = dataService.ParValues.FirstOrDefault();
            var parValueAmount = parvalueInfo.Amount;

            foreach (var shareholder in shareholderList)
            {
                if (shareholderSubscriptionSummeryList != null)
                {
                    var shareholderSubscriptionInfo = shareholderSubscriptionSummeryList.Where(sub => sub.ShareholderId == shareholder.Id).FirstOrDefault();
                    if (shareholderSubscriptionInfo != null)
                    {
                        var shareholderPaidupSummery = new PaidUpSummeryByShareholderDto
                        {
                            ShareholderId = shareholder.ShareholderNumber,
                            ShareholderName = shareholder.DisplayName,
                            TotalPayments = (double)shareholderSubscriptionInfo.ApprovedPaymentsAmount,
                            TotalShareValue = (double)(shareholderSubscriptionInfo.ApprovedPaymentsAmount / parValueAmount),
                        };
                        shareholderPaidupList.Add(shareholderPaidupSummery);
                    }
                }
            }
            return shareholderPaidupList;
        }
    }
}