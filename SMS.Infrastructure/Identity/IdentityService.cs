using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using SMS.Application;
using SMS.Domain.User;

namespace SMS.Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<SMSUser> userManager;
        private readonly IUserClaimsPrincipalFactory<SMSUser> userClaimsPrincipalFactory;
        private readonly IAuthorizationService authorizationService;

        public IdentityService(
            UserManager<SMSUser> userManager,
            IUserClaimsPrincipalFactory<SMSUser> userClaimsPrincipalFactory,
            IAuthorizationService authorizationService)
        {
            this.userManager = userManager;
            this.userClaimsPrincipalFactory = userClaimsPrincipalFactory;
            this.authorizationService = authorizationService;
        }

        public async Task<bool> IsInRoleAsync(string userId, string role)
        {
            var user = userManager.Users.SingleOrDefault(u => u.Id == userId);

            return user != null && await userManager.IsInRoleAsync(user, role);
        }

        public async Task<bool> AuthorizeAsync(string userId, string policyName)
        {
            var user = userManager.Users.SingleOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return false;
            }

            var principal = await userClaimsPrincipalFactory.CreateAsync(user);

            var result = await authorizationService.AuthorizeAsync(principal, policyName);

            return result.Succeeded;
        }

        public async Task<IList<string>> GetUserRoles(string userId)
        {
            var user = userManager.Users.SingleOrDefault(u => u.Id == userId);
            if (user == null) return null;
            return await userManager.GetRolesAsync(user);
        }
    }
}
