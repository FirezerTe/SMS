namespace SMS.Application;

public class ShareholderDetailsDto : ShareholderBasicInfo
{
    public List<AddressDto> Addresses { get; set; }
    public List<ContactDto> Contacts { get; set; }
    public List<FamilyDto> Families { get; set; }
}
