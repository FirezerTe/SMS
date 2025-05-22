using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetOrganizationListReportDataQuery : IRequest<OrganizationListReportDto>
    {
        public string organizations { get; set; }
    }

    public class GetOrganizationListReportDataQueryHandler : IRequestHandler<GetOrganizationListReportDataQuery, OrganizationListReportDto>
    {
        private readonly IDataService dataService;

        public GetOrganizationListReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<OrganizationListReportDto> Handle(GetOrganizationListReportDataQuery request, CancellationToken cancellationToken)
        {

            return new OrganizationListReportDto
            {
                OrganizationList = await GetOrganizationsAsync(request),
                Organizations = request.organizations,
            };
        }
        private async Task<List<OrganizationListDto>> GetOrganizationsAsync(GetOrganizationListReportDataQuery request)
        {
            var organization = new List<OrganizationListDto>();
            var shareholderOrganization = new List<Shareholder>();
            var shareholderList = await dataService.Shareholders.ToListAsync();
            var organizationList = dataService.ShareholderTypes
                .Where(a => a.DisplayName == request.organizations)
                .FirstOrDefault();
            var ShareholderAddress = await dataService.Addresses.ToListAsync();
            var shareholderContact = await dataService.Contacts.ToListAsync();
            shareholderOrganization = await dataService.Shareholders
                .Where(a => a.ShareholderType == organizationList.Value).ToListAsync();

            for (int i = 0; i < shareholderOrganization.Count; i++)
            {
                var sequence = i + 1;
                var searchShareholder = shareholderList.Where(a => a.Id == shareholderOrganization[i].Id).FirstOrDefault();
                var address = ShareholderAddress.Where(a => a.ShareholderId == shareholderOrganization[i].Id).FirstOrDefault();
                var contact = shareholderContact.Where(a => a.ShareholderId == shareholderOrganization[i].Id && a.Type == Domain.Enums.ContactType.CellPhone).FirstOrDefault();
                if (contact != null)
                {
                    var shareholder = new OrganizationListDto
                    {
                        Sequence = sequence,
                        ShareholderName = searchShareholder.DisplayName,
                        ShareholderId = shareholderOrganization[i].Id,
                        RepresentativeName = shareholderOrganization[i].RepresentativeName,
                        RepresentativeEmail = shareholderOrganization[i].RepresentativeEmail,
                        City = address.City,
                        Kebele = address.Kebele,
                        Woreda = address.Woreda,
                        contact = contact.Value

                    };
                    organization.Add(shareholder);
                }
            }
            return organization;
        }
    }
}