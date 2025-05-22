namespace SMS.Api.Dtos;

public class RegisterDto
{
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public int BranchId { get; set; }
    public List<string> Roles { get; set; }
}
