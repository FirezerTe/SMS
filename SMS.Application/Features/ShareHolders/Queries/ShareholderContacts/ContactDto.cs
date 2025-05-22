using SMS.Domain.Enums;

namespace SMS.Application;

public class ContactDto
{
    public int Id { get; set; }
    public int ShareholderId { get; set; }
    public ContactType Type { get; set; }
    public string Value { get; set; }

    public string Description => Type switch
    {
        ContactType.Email => "Email",
        ContactType.Fax => "Fax",
        ContactType.HomePhone => "Home Phone",
        ContactType.CellPhone => "Mobile",
        ContactType.WorkPhone => "Work",
        _ => "Unknown"
    };
}
