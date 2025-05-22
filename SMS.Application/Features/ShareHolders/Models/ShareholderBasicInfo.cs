using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public class ShareholderBasicInfo
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
    public string? AccountNumber { get; set; }
    public DateOnly? DateOfBirth { get; set; }

    public Gender Gender { get; set; }
    public bool? EthiopianOrigin { get; set; }
    public int CountryOfCitizenship { get; set; }
    public string? PassportNumber { get; set; }
    public ShareholderType Type { get; set; }
    public ShareholderTypeEnum ShareholderType { get; set; }
    public ShareholderStatusEnum ShareholderStatus { get; set; }
    public ShareholderStatus Status { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public string? TinNumber { get; set; }
    public string? FileNumber { get; set; }
    public bool IsNew { get; set; }
    public bool IsOtherBankMajorShareholder { get; set; }

    public bool HasRelatives { get; set; }
    public DateOnly RegistrationDate { get; set; }
    public string? PhotoUrl { get; set; }
    public string? PhotoId { get; set; }
    public string? SignatureId { get; set; }

    public List<ShareholderComment>? Comments { get; set; }
}
