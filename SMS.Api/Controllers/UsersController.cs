using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application;

namespace SMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController<UsersController>
    {
        private readonly IIdentityService identityService;

        public UsersController(IIdentityService identityService) : base()
        {
            this.identityService = identityService;
        }

        [Authorize]
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<UserDto> CurrentUserInfo()
        {
            CurrentUser.Roles = await identityService.GetUserRoles(CurrentUser.Id);
            CurrentUser.Permissions = await GetPermissions();

            return CurrentUser;
        }
    }
}
