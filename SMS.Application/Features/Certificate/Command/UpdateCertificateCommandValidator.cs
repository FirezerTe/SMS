using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application.Features.Certificate.Command;

public class UpdateCertificateCommandValidator : AbstractValidator<UpdateShareholderCertificateCommand>
{
    private readonly IDataService dataService;

    public UpdateCertificateCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(p => p.PaidupAmount).NotEmpty().WithMessage("Paid Up Amount is required.");
        RuleFor(p => p.CertificateNo).NotEmpty().WithMessage("Certificate Number is required.");
        RuleFor(p => p).MustAsync(ExistAsync).WithMessage($"Unable to find shareholder.");
        RuleFor(p => p).MustAsync(InvalidPaidupAmount).WithMessage($"Paid-up amount  entered exceeds the total paid-up amount of the shareholder available for certificate issuance");
    }

    private async Task<bool> InvalidPaidupAmount(UpdateShareholderCertificateCommand command, CancellationToken token)
    {
        var shareholderAmountInformation = dataService.ShareholderSubscriptionsSummaries.Where(sh => sh.ShareholderId == command.ShareholderId).FirstOrDefault();
        var issuedCertificates = await dataService.Certficates.Where(cer => cer.ShareholderId == command.ShareholderId && cer.IsActive == true && cer.Id != command.Id).ToListAsync();
        var totalIssuedPaidups = issuedCertificates.Sum(cer => cer.PaidupAmount);

        if (command.PaidupAmount > shareholderAmountInformation.ApprovedPaymentsAmount - totalIssuedPaidups)
            return false;
        else
            return true;
    }

    private async Task<bool> ExistAsync(UpdateShareholderCertificateCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == command.ShareholderId);
        return shareholder != null;
    }
}