using SMS.Domain.Enums;
using SMS.Domain;

namespace SMS.Application;

public class ShareholderInfo : WorkflowEnabledEntityDto
{
    public int Id { get; set; }
    public int ShareholderNumber { get; set; }
    public string Name { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public string DisplayName { get; set; }
    public string AmharicName { get; set; }
    public string AmharicMiddleName { get; set; }
    public string AmharicLastName { get; set; }
    public string AmharicDisplayName { get; set; }
    public bool? IsBlocked { get; set; }
    public Gender Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public int CountryOfCitizenship { get; set; }
    public bool? EthiopianOrigin { get; set; }
    public string? PassportNumber { get; set; }
    public ShareholderTypeEnum ShareholderType { get; set; }
    public string? AccountNumber { get; set; }
    public ShareholderStatusEnum ShareholderStatus { get; set; }
    public string? TinNumber { get; set; }
    public string? FileNumber { get; set; }

    public bool IsNew { get; set; }
    public bool HasActiveTransfer { get; set; }
    public bool IsOtherBankMajorShareholder { get; set; }
    public bool HasRelatives { get; set; }
    public DateOnly RegistrationDate { get; set; }

    public bool IsCurrent { get; set; }

    public string? PhotoId { get; set; }
    public string? PhotoUrl { get; set; }
    public string? SignatureId { get; set; }

    public string? RepresentativeName { get; set; }
    public string? RepresentativeEmail { get; set; }
    public string? RepresentativePhoneNumber { get; set; }
    public RepresentativeAddress? RepresentativeAddress { get; set; }

    public List<ShareholderComment>? Comments { get; set; }

}
