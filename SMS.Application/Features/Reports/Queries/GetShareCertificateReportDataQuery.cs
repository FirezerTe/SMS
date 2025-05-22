using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports
{
    public class GetShareCertificateReportDataQuery : IRequest<ShareCertificateReportDto>
    {
        public int ShareholderId { get; set; }
        public int CertificateId { get; set; }
    }

    public class GetShareCertificateReportDataQueryHandler :
        IRequestHandler<GetShareCertificateReportDataQuery, ShareCertificateReportDto>
    {
        private readonly IDataService dataService;

        public GetShareCertificateReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<ShareCertificateReportDto> Handle(GetShareCertificateReportDataQuery request, CancellationToken cancellationToken)
        {
            var shareholder = await dataService.Shareholders
                .Include(sh => sh.Contacts)
                .Include(sh => sh.Addresses).FirstOrDefaultAsync(sh => sh.Id == request.ShareholderId);
            var certificateInfo = dataService.Certficates.Where(cer => cer.Id == request.CertificateId).FirstOrDefault();

            var primaryAddress = shareholder.Addresses?.FirstOrDefault();
            var primaryPhoneNumber = shareholder?.Contacts?.FirstOrDefault(c => c.Type == Domain.Enums.ContactType.CellPhone)?.Value;
            var bankAmountInformation = await dataService.ShareholderSubscriptionsSummaries.ToListAsync();
            var shareholderAmountInformation = dataService.ShareholderSubscriptionsSummaries.Where(sh => sh.ShareholderId == request.ShareholderId).FirstOrDefault();
            var issuedCertificates = await dataService.Certficates.Where(cer => cer.ShareholderId == request.ShareholderId && cer.IsActive == true).ToListAsync();
            var totalIssuedPaidups = issuedCertificates.Sum(cer => cer.PaidupAmount);
            var parvalue = dataService.ParValues.FirstOrDefault();
            var totalBankPaiup = bankAmountInformation.Sum(pay => pay.ApprovedPaymentsAmount);
            var totalBanksubscription = bankAmountInformation.Sum(sub => sub.ApprovedSubscriptionAmount);
            var shareCertificateReport = new ShareCertificateReportDto
            {
                DisplayNameAmharic = shareholder.AmharicDisplayName,
                DisplayNameEnglish = shareholder.DisplayName,
                PaidUpShareInBirr = (int)(certificateInfo.PaidupAmount),
                PaidUpSubscriptionInBirr = (int)shareholderAmountInformation.ApprovedSubscriptionAmount,
                PlaceOfRegistration = "Head Office",
                RegistrationDate = shareholder.RegistrationDate,
                ShareholderId = shareholder.Id,
                RegistrationNumber = shareholder.FileNumber,
                ShareholderPhoneNumber = primaryPhoneNumber,
                ShareParValue = (int)parvalue.Amount,
                TotalShareCount = (int)((certificateInfo.PaidupAmount) / parvalue.Amount),
                TotalShareInBirr = (double)Math.Round(totalBankPaiup, 2),
                TotalSubscriptionInBirr = (double)Math.Round(totalBanksubscription, 2),
                CertificateNumber = certificateInfo.CertificateNo,
                Address = new ShareholderAddressDto
                {
                    City = primaryAddress?.City,
                    HouseNumber = primaryAddress?.HouseNumber,
                    Kebele = primaryAddress?.Kebele,
                    SubCity = primaryAddress?.SubCity,
                    Woreda = primaryAddress?.Woreda
                }
            };
            if (certificateInfo != null)
            {
                certificateInfo.IsActive = true;
                certificateInfo.IsPrinted = true;
                certificateInfo.ApprovalStatus = ApprovalStatus.Submitted;
            }

            await dataService.SaveAsync(cancellationToken);
            certificateInfo.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return shareCertificateReport;
        }
    }
}