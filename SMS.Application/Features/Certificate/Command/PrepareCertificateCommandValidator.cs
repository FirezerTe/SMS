using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application.Features.Certificate.Command;

public class PrepareCertificateCommandValidator : AbstractValidator<PrepareShareholderCertificateCommand>
{
    private readonly IDataService dataService;
    private readonly IParValueService parValueService;

    public PrepareCertificateCommandValidator(IDataService dataService, IParValueService parValueService)
    {
        this.dataService = dataService;
        this.parValueService = parValueService;
        RuleFor(p => p.PaidupAmount).NotEmpty().WithMessage("Paid Up Amount is required.");
        RuleFor(p => p.CertificateNo).NotEmpty().WithMessage("Certificate Number is required.");
        RuleFor(p => p.IssueDate).NotEmpty().WithMessage("Issue Date is required.");
        RuleFor(p => p).MustAsync(ExistAsync).WithMessage($"Unable to find shareholder.");
        RuleFor(p => p).MustAsync(DuplicateCertificateNumber).WithMessage($"Duplicate Certificate Number.");
        RuleFor(p => p).MustAsync(NotDivisiableByCurrentParValue).WithMessage($"Amount must be multiple of Par Value.");
        RuleFor(p => p).MustAsync(InvalidPaidupAmount).WithMessage($"Paid-up amount  entered exceeds the total paid-up amount of the shareholder available for certificate issuance ");
    }

    private async Task<bool> InvalidPaidupAmount(PrepareShareholderCertificateCommand command, CancellationToken token)
    {
        var shareholderAmountInformation = dataService.ShareholderSubscriptionsSummaries.Where(sh => sh.ShareholderId == command.ShareholderId).FirstOrDefault();
        var issuedCertificates = await dataService.Certficates.Where(cer => cer.ShareholderId == command.ShareholderId && cer.IsActive == true).ToListAsync();
        var totalIssuedPaidups = issuedCertificates.Sum(cer => cer.PaidupAmount);

        if (command.PaidupAmount > shareholderAmountInformation.ApprovedPaymentsAmount - totalIssuedPaidups)
            return false;
        else
            return true;
    }

    private async Task<bool> ExistAsync(PrepareShareholderCertificateCommand command, CancellationToken token)
    {
        var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == command.ShareholderId);
        return shareholder != null;
    }
    private async Task<bool> DuplicateCertificateNumber(PrepareShareholderCertificateCommand command, CancellationToken token)
    {
        var certificates = await dataService.Certficates.ToListAsync();
        foreach (var certificate in certificates)
        {
            if (command.CertificateNo == certificate.CertificateNo) return false;
        }
        return true;
    }
    private async Task<bool> NotDivisiableByCurrentParValue(PrepareShareholderCertificateCommand command, CancellationToken token)
    {
        var currentParValueAmount = (await parValueService.GetCurrentParValue())?.Amount ?? 0;
        if (command.PaidupAmount % currentParValueAmount != 0) return false;

        return true;
    }
}