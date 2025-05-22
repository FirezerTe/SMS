
namespace SMS.Application
{

    public class Role
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
    }

    public class Claim
    {
        public string? ClaimType { get; set; }

        public string? ClaimValue { get; set; }
    }
    public class UserDetail
    {
        public string Id { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; }
        public int BranchId { get; set; }
        public int AccessFailedCount { get; set; }
        public List<Role>? Roles { get; set; }
        public List<Claim>? Claims { get; set; }
        public bool IsDeactivated { get; set; }
    }

    public interface IUserRepository
    {
        Task RegisterUserAsync();
        Task LoginAsync();
        Task ResetPasswordAsync();
        Task ForgetPasswordAsync();
        Task<List<UserDetail>> GetAllUsers();
        Task<List<Role>> GetAllRoles();
        Task<UserDetail> GetUserById(string userId);
    }
}