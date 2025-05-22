using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application.Features.Reports
{
    public class GetForeignNationalShareholdersReportDataQuery : IRequest<ShareholderListReportDto>
    {
    }
    public class GetForeignNationalShareholdersReportDataQueryHandler :
      IRequestHandler<GetForeignNationalShareholdersReportDataQuery, ShareholderListReportDto>
    {
        private readonly IDataService dataService;

        public GetForeignNationalShareholdersReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<ShareholderListReportDto> Handle(GetForeignNationalShareholdersReportDataQuery request, CancellationToken cancellationToken)
        {
            var foreignNationalShareholders = new List<ShareholderListDto>();
            var countriesList = await dataService.Countries.ToListAsync();
            var ethiopiaCountryRecord = countriesList.Where(Cou => Cou.Code == "ETH").FirstOrDefault();
            var ethiopiaCountryCode = ethiopiaCountryRecord.Id;
            var foreignerShareholders = await dataService.Shareholders.Where(sh => sh.CountryOfCitizenship != ethiopiaCountryCode).ToListAsync();
            var foreignerShareholdersIds = foreignerShareholders.Select(x => x.Id);
            var contactList = await dataService.Contacts.Where(s => foreignerShareholdersIds.Contains(s.ShareholderId)).ToListAsync();
            var shareholderSubscriptionSummeryList = await dataService.ShareholderSubscriptionsSummaries.Where(s => foreignerShareholdersIds.Contains(s.ShareholderId)).ToListAsync();


            foreach (var sh in foreignerShareholders)
            {
                var countryInfo = countriesList.Where(ch => ch.Id == sh.CountryOfCitizenship).FirstOrDefault();
                var phoneContactInfo = contactList.Where(co => co.ShareholderId == sh.Id && co.Type == Domain.Enums.ContactType.CellPhone).FirstOrDefault();
                var emailContactInfo = contactList.Where(co => co.ShareholderId == sh.Id && co.Type == Domain.Enums.ContactType.Email).FirstOrDefault();
                var ethiopianOrgin = new string("");
                if (sh.EthiopianOrigin == false) { ethiopianOrgin = "Yes"; }
                else { ethiopianOrgin = "No"; }
                var shareholderSubscriptionInfo = shareholderSubscriptionSummeryList.Where(sub => sub.ShareholderId == sh.Id).FirstOrDefault();
                if (shareholderSubscriptionInfo != null)
                {
                    if (countryInfo != null)
                    {
                        var shareholderInfo = new ShareholderListDto
                        {
                            ShareholderId = sh.ShareholderNumber,
                            ShareholderName = sh.DisplayName,
                            TotalPaidUpInBirr = (double)shareholderSubscriptionInfo.ApprovedPaymentsAmount,
                            TotalSubscription = (double)shareholderSubscriptionInfo.ApprovedSubscriptionAmount,
                            CountryOfCitizenship = countryInfo.Name,
                            EthiopianOrgin = ethiopianOrgin,
                            PhoneNumber = phoneContactInfo?.Value,
                            EmailAddress = emailContactInfo?.Value,
                        };
                        foreignNationalShareholders.Add(shareholderInfo);
                    }
                }
            }
            return new ShareholderListReportDto
            {
                Shareholders = foreignNationalShareholders,
                TotalSubscription = foreignNationalShareholders.Sum(fs => fs.TotalSubscription),
                TotalPaymentAmount = foreignNationalShareholders.Sum(fs => fs.TotalPaidUpInBirr)
            };
        }
    }
}