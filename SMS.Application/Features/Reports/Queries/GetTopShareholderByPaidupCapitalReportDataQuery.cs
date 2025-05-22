using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;

namespace SMS.Application.Features.Reports
{
    public class GetTopShareholderByPaidupCapitalReportDataQuery : IRequest<PaidUpSummeryByShareholderDtoReportDto>
    {
        public int Count { get; set; }
    }

    public class GetTopShareholderByPaidupCapitalReportDataQueryHandler :
    IRequestHandler<GetTopShareholderByPaidupCapitalReportDataQuery, PaidUpSummeryByShareholderDtoReportDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetTopShareholderByPaidupCapitalReportDataQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<PaidUpSummeryByShareholderDtoReportDto> Handle(GetTopShareholderByPaidupCapitalReportDataQuery request, CancellationToken cancellationToken)
        {
            var paymentsList = await GetTotalPaidup(request);
            var totalPaymentAmount = paymentsList.Sum(payment => payment.TotalPayments);
            var totalNoOfShares = paymentsList.Sum(payment => payment.TotalShareValue);
            return new PaidUpSummeryByShareholderDtoReportDto
            {
                Count = request.Count,
                PaymentsTotal = await GetTotalPaidup(request),
                TotalPaymentAmount = totalPaymentAmount,
                TotalNoOfShares = totalNoOfShares
            };
        }
        private async Task<List<PaidUpSummeryByShareholderDto>> GetTotalPaidup(GetTopShareholderByPaidupCapitalReportDataQuery request)
        {
            var topXShareholders = new List<PaidUpSummeryByShareholderDto>();
            var shareholderList = await dataService.Shareholders.ToListAsync();
            var shareholderSubscriptionSummeryList = await dataService.ShareholderSubscriptionsSummaries.ToListAsync();

            var parvalueInfo = dataService.ParValues.FirstOrDefault();
            var parValueAmount = parvalueInfo.Amount;

            foreach (var shareholder in shareholderList)
            {
                var shareholderPaymentInfo = shareholderSubscriptionSummeryList.Where(sub => sub.ShareholderId == shareholder.Id).FirstOrDefault();
                if (shareholderPaymentInfo != null)
                {
                    var shareholderPaidupSummery = new PaidUpSummeryByShareholderDto
                    {
                        ShareholderId = shareholder.ShareholderNumber,
                        ShareholderName = shareholder.DisplayName,
                        TotalPayments = (double)shareholderPaymentInfo.ApprovedPaymentsAmount,
                        TotalShareValue = (double)(shareholderPaymentInfo.ApprovedPaymentsAmount / parValueAmount),
                    };
                    topXShareholders.Add(shareholderPaidupSummery);
                }
            }
            var topShareholdersList = topXShareholders.OrderByDescending(pay => pay.TotalPayments).Take(request.Count).ToList();
            return topShareholdersList;
        }
    }
}