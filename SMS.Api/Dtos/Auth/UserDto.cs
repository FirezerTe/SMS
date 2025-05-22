namespace SMS.Api.Dtos;

public record Permission(string Name, bool HasPermission);

public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public int BranchId { get; set; }
    public IList<string> Roles { get; set; }
    public IList<Permission> Permissions { get; set; }

    public UserDto()
    {

    }
    public UserDto(string id, string email, string firstName, string middleName, string lastName, int branchId)
    {
        Id = id;
        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
        Email = email;
        BranchId = branchId;
    }

    public string FullName
    {
        get
        {
            return $@"{FirstName}{(!string.IsNullOrWhiteSpace(MiddleName) ? $" {MiddleName}" : "")}{(!string.IsNullOrWhiteSpace(LastName) ? $" {LastName}" : "")}";
        }
    }

}