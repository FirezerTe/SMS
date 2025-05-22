using MediatR;
using SMS.Application.Exceptions;
using SMS.Domain;

namespace SMS.Application;

public class UpdateShareholderCommandHandler : IRequestHandler<UpdateShareholderCommand, int>
{
    private readonly IDataService dataService;
    private readonly IShareholderChangeLogService shareholderChangeLogService;

    public UpdateShareholderCommandHandler(IDataService dataService, IShareholderChangeLogService shareholderChangeLogService)
    {
        this.dataService = dataService;
        this.shareholderChangeLogService = shareholderChangeLogService;
    }

    public async Task<int> Handle(UpdateShareholderCommand request, CancellationToken cancellationToken)
    {
        var shareholder = dataService.Shareholders.FirstOrDefault(x => x.Id == request.Id);
        if (shareholder == null)
        {
            throw new NotFoundException($"Unable to find shareholder", request);
        }

        shareholder.Name = request.Name;
        shareholder.MiddleName = request.MiddleName;
        shareholder.LastName = request.LastName;
        shareholder.AmharicName = request.AmharicName;
        shareholder.AmharicMiddleName = request.AmharicMiddleName;
        shareholder.AmharicLastName = request.AmharicLastName;
        shareholder.CountryOfCitizenship = request.CountryOfCitizenship;
        shareholder.PassportNumber = request.PassportNumber;
        shareholder.EthiopianOrigin = request.EthiopianOrigin;
        shareholder.TinNumber = request.TinNumber;
        shareholder.FileNumber = request.FileNumber;
        shareholder.DateOfBirth = request.DateOfBirth;
        shareholder.AccountNumber = request.AccountNumber;
        shareholder.RegistrationDate = request.RegistrationDate;
        shareholder.IsOtherBankMajorShareholder = request.IsOtherBankMajorShareholder;
        shareholder.HasRelatives = request.HasRelatives;
        shareholder.Gender = request.Gender;

        await dataService.SaveAsync(cancellationToken);
        await shareholderChangeLogService.LogShareholderBasicInfoChange(shareholder, ChangeType.Modified, cancellationToken);

        return shareholder.Id;
    }
}