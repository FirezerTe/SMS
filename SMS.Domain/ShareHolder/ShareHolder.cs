using SMS.Domain.Enums;

namespace SMS.Domain;

public class Shareholder : WorkflowEnabledEntity
{
    public int ShareholderNumber { get; set; }
    public string Name { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public string DisplayName { get; set; }
    public string AmharicName { get; set; }
    public ShareHolderCategory? shareHolderCategory { get; set; }
    public string? AmharicMiddleName { get; set; }
    public string? AmharicLastName { get; set; }
    public string AmharicDisplayName { get; set; }
    public Gender Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public int CountryOfCitizenship { get; set; }
    public bool? EthiopianOrigin { get; set; }
    public string? PassportNumber { get; set; }
    public ShareholderTypeEnum ShareholderType { get; set; }
    public ShareholderType Type { get; set; }
    public ShareholderStatusEnum ShareholderStatus { get; set; }
    public ShareholderStatus Status { get; set; }
    public string? AccountNumber { get; set; }
    public string? TinNumber { get; set; }
    public string? FileNumber { get; set; }

    public bool? IsNew { get; set; }
    //public bool HasActiveTransfer { get; set; }
    public bool IsBlocked { get; set; }
    public bool IsOtherBankMajorShareholder { get; set; }
    public bool HasRelatives { get; set; }
    public DateOnly RegistrationDate { get; set; }


    public string? RepresentativeName { get; set; }
    public string? RepresentativeEmail { get; set; }
    public string? RepresentativePhoneNumber { get; set; }
    public RepresentativeAddress? RepresentativeAddress { get; set; }

    public ICollection<Address> Addresses { get; set; }
    public ICollection<Contact> Contacts { get; set; }
    public ICollection<Subscription> Subscriptions { get; set; }
    public ICollection<ShareholderDocument> ShareholderDocuments { get; set; }
    public ICollection<Family> Families { get; set; }
    public ICollection<ShareholderComment> ShareholderComments { get; set; }
    public ICollection<ShareholderFamily> ShareholderFamilies { get; set; }
    public ICollection<Certficate> Certficates { get; set; }
}
