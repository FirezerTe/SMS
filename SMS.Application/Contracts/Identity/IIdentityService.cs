namespace SMS.Application
{
    public interface IIdentityService
    {
        Task<bool> AuthorizeAsync(string userId, string policyName);
        Task<bool> IsInRoleAsync(string userId, string v);
        Task<IList<string>> GetUserRoles(string userId);
    }
}
