using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports
{
    public class GetActiveShareholdersReportDataQuery : IRequest<ShareholderListReportDto>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public ShareholderStatusEnum? ShareholderStatusEnum { get; set; }
    }

    public class GetActiveShareholdersReportDataQueryHandler :
      IRequestHandler<GetActiveShareholdersReportDataQuery, ShareholderListReportDto>
    {
        private readonly IDataService dataService;

        public GetActiveShareholdersReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<ShareholderListReportDto> Handle(GetActiveShareholdersReportDataQuery request, CancellationToken cancellationToken)
        {
            var ActiveShareholders = new List<ShareholderListDto>();
            var toDate = request.ToDate.AddDays(1);
            var ActiveShareholdersList = await dataService.Shareholders
                                                  .TemporalContainedIn(request.FromDate.Date, toDate)
                                                  .OrderBy(sh => EF.Property<DateTime>(sh, "PeriodStart"))
                                                  .Where(sh => sh.ShareholderStatus == ShareholderStatusEnum.Active)
                                                        .Select(sh => new ShareholderListDto
                                                        {
                                                            ShareholderId = sh.ShareholderNumber,
                                                            ShareholderName = sh.DisplayName,
                                                            RegistrationDate = sh.RegistrationDate.ToString("dd MMMM yyyy"),
                                                            Status = sh.IsNew,
                                                        })
                                                  .Distinct()
                                                  .ToListAsync();

            var shareholderSubscriptionInformationList = await dataService.ShareholderSubscriptionsSummaries
                                                 .ToListAsync();
            var parvalue = dataService.ParValues.TemporalBetween(request.FromDate, request.ToDate).FirstOrDefault();
            var parvalueAmount = parvalue.Amount;
            if (request.ShareholderStatusEnum != 0)
            {
                bool activeShareholderStatus = false;
                if (request.ShareholderStatusEnum != ShareholderStatusEnum.New)
                {
                    activeShareholderStatus = false;
                }
                else
                {
                    activeShareholderStatus = true;
                }
                var activeShareholdersByStatusList = ActiveShareholdersList.Where(sh => sh.Status == activeShareholderStatus).ToList();
                foreach (var activeShareholder in activeShareholdersByStatusList)
                {
                    var shareholderSubscriptionInfo = shareholderSubscriptionInformationList
                                                               .Where(sub => sub.ShareholderId == activeShareholder.ShareholderId)
                                                               .FirstOrDefault();

                    if (shareholderSubscriptionInfo.ApprovedPaymentsAmount > parvalueAmount)
                    {
                        if ((bool)activeShareholder.Status) { activeShareholder.ShareholderStatus = ShareholderStatusEnum.New.ToString(); }
                        else { activeShareholder.ShareholderStatus = "Existing"; }
                        activeShareholder.TotalPaidUpInBirr = (double)shareholderSubscriptionInfo.ApprovedPaymentsAmount;
                        activeShareholder.TotalPaidUpShares = (int)(shareholderSubscriptionInfo.ApprovedPaymentsAmount / parvalueAmount);
                        ActiveShareholders.Add(activeShareholder);
                    }
                }
            }
            else
            {
                foreach (var activeShareholder in ActiveShareholdersList)
                {
                    var shareholderSubscriptionInfo = shareholderSubscriptionInformationList
                                                                .Where(sub => sub.ShareholderId == activeShareholder.ShareholderId)
                                                                .FirstOrDefault();

                    if (shareholderSubscriptionInfo.ApprovedPaymentsAmount > parvalueAmount)
                    {
                        if ((bool)activeShareholder.Status) { activeShareholder.ShareholderStatus = ShareholderStatusEnum.New.ToString(); }
                        else { activeShareholder.ShareholderStatus = "Existing"; }
                        activeShareholder.TotalPaidUpInBirr = (double)shareholderSubscriptionInfo.ApprovedPaymentsAmount;
                        activeShareholder.TotalPaidUpShares = (int)(shareholderSubscriptionInfo.ApprovedPaymentsAmount / parvalueAmount);
                        ActiveShareholders.Add(activeShareholder);
                    }
                }
            }
            return new ShareholderListReportDto
            {
                Shareholders = ActiveShareholders
            };
        }
    }
}