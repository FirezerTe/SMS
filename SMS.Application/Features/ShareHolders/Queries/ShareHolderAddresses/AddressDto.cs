namespace SMS.Application;

public class AddressDto
{
    public int Id { get; set; }
    public int CountryId { get; set; }
    public string City { get; set; }
    public string SubCity { get; set; }
    public string Kebele { get; set; }
    public string Woreda { get; set; }

    public string HouseNumber { get; set; }

    public int ShareholderId { get; set; }
}
