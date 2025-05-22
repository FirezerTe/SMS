using MediatR;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public class UpdateShareholderCommand : IRequest<int>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public string AmharicName { get; set; }
    public string? AmharicMiddleName { get; set; }
    public string? AmharicLastName { get; set; }
    public int CountryOfCitizenship { get; set; }
    public bool? EthiopianOrigin { get; set; }
    public string? PassportNumber { get; set; }
    public ShareholderTypeEnum ShareholderType { get; set; }

    public string? AccountNumber { get; set; }
    public string? TinNumber { get; set; }
    public string? FileNumber { get; set; }
    public bool IsOtherBankMajorShareholder { get; set; }
    public bool HasRelatives { get; set; }
    public Gender Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public DateOnly RegistrationDate { get; set; }
}
