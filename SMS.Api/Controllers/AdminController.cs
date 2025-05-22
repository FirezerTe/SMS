using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application;
using SMS.Application.Features.User.Queries;
using SMS.Application.Models;
using SMS.Application.Security;
using SMS.Domain.Enums;
using SMS.Domain.User;
using Claim = System.Security.Claims.Claim;

namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdminController : BaseController<AdminController>
{
    private readonly UserManager<SMSUser> userManager;
    private readonly IConfiguration configuration;

    public AdminController(UserManager<SMSUser> userManager, IConfiguration configuration) : base()
    {
        this.userManager = userManager;
        this.configuration = configuration;
    }

    [HttpPost("register-user")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = AuthPolicy.CanCreateOrUpdateUser)]
    public async Task<ActionResult<SMSUser>> RegisterUser(RegisterDto registerDto)
    {
        //TODO: validate
        var user = new SMSUser()
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            MiddleName = registerDto.MiddleName,
            LastName = registerDto.LastName,
            BranchId = registerDto.BranchId,
            EmailConfirmed = true,
            TwoFactorEnabled = true
        };

        var random = new Random();
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var password = new string(Enumerable.Repeat(chars, random.Next(8, 12))
            .Select(s => s[random.Next(s.Length)]).ToArray());

        while (!password.Any(char.IsDigit))
        {
            password = password + new string(Enumerable.Repeat("0123456789", random.Next(1, 3))
           .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        var result = await userManager.CreateAsync(user, password);

        if (registerDto.Roles?.Count() > 0)
        {
            await userManager.AddToRolesAsync(user, registerDto.Roles);
        }

        if (result.Succeeded)
        {
            await mediator.Send(new CreateEmailNotificationCommand()
            {
                Notification = new EmailNotification()
                {
                    ToEmail = user.Email,
                    ToName = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                    EmailType = EmailType.AppUserCreated,
                    Subject = "Account Created",
                    Model = new
                    {
                        Name = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                        SmsUrl = configuration.GetValue<string>("AppUrl"),
                        TempPassword = password
                    }
                }
            });

            return Ok(user);
        }
        var errors = result.Errors.Where(e => e.Code != "DuplicateUserName")
                                  .Select(error => new { error.Code, error.Description })
                                  .ToDictionary(t => t.Code, t => t.Description);

        return BadRequest(errors);

    }

    [HttpPost("user/add-claims")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesDefaultResponseType]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = AuthPolicy.CanCreateOrUpdateUser)]
    public async Task<ActionResult<UserDto>> AddClaims(string userId, [FromBody] Dictionary<string, string> claims)
    {

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return BadRequest();
        }

        var currentClaims = await userManager.GetClaimsAsync(user) ?? new List<Claim>();

        var newClaimsToAdd = claims.ToList().Where(claim => !currentClaims.Any(c => c.Value == claim.Value)).Select(c => new Claim(c.Key, c.Value));

        if (newClaimsToAdd?.Count() > 0)
        {
            var result = await userManager.AddClaimsAsync(user, newClaimsToAdd);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                throw new Exception($"Unable to add claims to user: {user.Email} ");
            }

        }

        return Ok();
    }

    [HttpGet("users")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = AuthPolicy.CanCreateOrUpdateUser)]
    public async Task<ActionResult<List<UserDetail>>> Users()
    {
        var users = await mediator.Send(new GetAllUsersQuery());
        return Ok(users);
    }

    [HttpGet("users/:id")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = AuthPolicy.CanCreateOrUpdateUser)]
    public async Task<ActionResult<UserDetail>> GetUserDetail(string id)
    {
        var user = await mediator.Send(new GetUserDetailQuery(id));
        return Ok(user);
    }

    [HttpPost("users/:id/:role")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesDefaultResponseType]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = AuthPolicy.CanCreateOrUpdateUser)]
    public async Task<ActionResult<UserDetail>> AddUserRole(string id, string role)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
            return BadRequest();
        if (!await userManager.IsInRoleAsync(user, role))
            await userManager.AddToRoleAsync(user, role);

        return Ok();
    }

    [HttpDelete("users/:id/:role")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesDefaultResponseType]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = AuthPolicy.CanCreateOrUpdateUser)]
    public async Task<ActionResult<UserDetail>> RemoveUserRole(string id, string role)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
            return BadRequest();
        if (await userManager.IsInRoleAsync(user, role))
            await userManager.RemoveFromRoleAsync(user, role);

        return Ok();
    }

    [HttpGet("roles")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ApplicationRole>>> GetRoles()
    {
        var users = await mediator.Send(new GetAllRolesQuery());
        return Ok(users);
    }
}
