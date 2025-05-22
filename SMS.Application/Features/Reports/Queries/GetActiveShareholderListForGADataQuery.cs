using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetActiveShareholderListForGADataQuery : IRequest<ActiveShareholderListForGAReportDto>
    {

    }

    public class GetActiveShareholderListForGADataQueryHandler : IRequestHandler<GetActiveShareholderListForGADataQuery, ActiveShareholderListForGAReportDto>
    {
        private readonly IDataService dataService;

        public GetActiveShareholderListForGADataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<ActiveShareholderListForGAReportDto> Handle(GetActiveShareholderListForGADataQuery request, CancellationToken cancellationToken)
        {
            return new ActiveShareholderListForGAReportDto
            {
                ActiveShareholderListForGA = await GetActiveListForGA(request),
            };
        }
        private async Task<List<ActiveShareholderListForGADto>> GetActiveListForGA(GetActiveShareholderListForGADataQuery request)
        {
            var activeShareholderList = new List<ActiveShareholderListForGADto>();
            var parvalue = await dataService.ParValues.Where(a => a.ApprovalStatus == Domain.Enums.ApprovalStatus.Approved).FirstOrDefaultAsync();
            var shareholderList = await dataService.Shareholders.Where(a => a.ApprovalStatus == Domain.Enums.ApprovalStatus.Approved).ToListAsync();
            var addressList = await dataService.Addresses.ToListAsync();
            var shareholderSubscriptionList = await dataService.ShareholderSubscriptionsSummaries.Where(a => a.ApprovedPaymentsAmount >= parvalue.Amount).ToListAsync();


            for (int i = 0; i < shareholderList.Count; i++)
            {
                var sequence = i + 1;
                var searchShareholderSubscription = shareholderSubscriptionList.Where(a => a.ShareholderId == shareholderList[i].Id).FirstOrDefault();
                var shareholderAddress = addressList.Where(a => a.ShareholderId == shareholderList[i].Id).FirstOrDefault();
                if (searchShareholderSubscription != null)
                {
                    var activeList = new ActiveShareholderListForGADto
                    {
                        Sequence = sequence,
                        ShareholderID = shareholderList[i].Id,
                        ShareholderName = shareholderList[i].DisplayName,
                        City = shareholderAddress?.City,
                        Subcity = shareholderAddress?.SubCity,
                        Woreda = shareholderAddress?.Woreda,
                        Kebele = shareholderAddress?.Kebele,
                        HouseNo = shareholderAddress?.HouseNumber,
                        ShareAmount = (searchShareholderSubscription?.ApprovedPaymentsAmount ?? 0) / parvalue.Amount,
                        VotingAmount = (searchShareholderSubscription?.ApprovedPaymentsAmount ?? 0) / parvalue.Amount,
                        Representative = shareholderList[i]?.RepresentativeName
                    };
                    activeShareholderList.Add(activeList);
                }
            }


            return activeShareholderList;
        }
    }
}