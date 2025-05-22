using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetListofFractionalPaidupAmountDataQuery : IRequest<PaidUpSummeryByShareholderDtoReportDto>
    {
    }
    public class GetListofFractionalPaidupAmountDataQueryHandler :
        IRequestHandler<GetListofFractionalPaidupAmountDataQuery, PaidUpSummeryByShareholderDtoReportDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetListofFractionalPaidupAmountDataQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<PaidUpSummeryByShareholderDtoReportDto> Handle(GetListofFractionalPaidupAmountDataQuery request, CancellationToken cancellationToken)
        {
            return new PaidUpSummeryByShareholderDtoReportDto
            {
                PaymentsTotal = await GetTotalPaidup(request)
            };
        }
        private async Task<List<PaidUpSummeryByShareholderDto>> GetTotalPaidup(GetListofFractionalPaidupAmountDataQuery request)
        {
            var shareholders = await dataService.Shareholders.ToListAsync();
            var subscriptionSubscriptionSummaryList = await dataService.ShareholderSubscriptionsSummaries.ToListAsync();
            var parvalueInfo = dataService.ParValues.FirstOrDefault();
            var parValueAmount = parvalueInfo.Amount;
            var shareholderPaidupList = new List<PaidUpSummeryByShareholderDto>();
            foreach (var shareholder in shareholders)
            {
                var shareholderPaymentInfo = subscriptionSubscriptionSummaryList.Where(sp => sp.ShareholderId == shareholder.Id && sp.ApprovedPaymentsAmount % parValueAmount != 0).FirstOrDefault();
                if (shareholderPaymentInfo != null)
                {
                    if (shareholderPaymentInfo.ApprovedPaymentsAmount != 0)
                    {
                        var shareholderInfo = new PaidUpSummeryByShareholderDto
                        {
                            ShareholderId = shareholder.ShareholderNumber,
                            ShareholderName = shareholder.DisplayName,
                            TotalPayments = (double)shareholderPaymentInfo.ApprovedPaymentsAmount,
                            TotalShareValue = (double)(shareholderPaymentInfo.ApprovedPaymentsAmount / parValueAmount)
                        };
                        shareholderPaidupList.Add(shareholderInfo);
                    }
                }
            }
            return shareholderPaidupList;
        }
    }
}