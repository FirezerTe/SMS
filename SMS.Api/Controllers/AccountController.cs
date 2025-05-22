using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application;
using SMS.Application.Security;
using SMS.Domain.Enums;
using SMS.Domain.User;
using System.Net;
using System.Security.Claims;
using Claim = System.Security.Claims.Claim;

namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : BaseController<AccountController>
{
    private readonly UserManager<SMSUser> userManager;
    private readonly SignInManager<SMSUser> signInManager;
    private readonly RoleManager<SMSRole> roleManager;
    private readonly IConfiguration configuration;

    public AccountController(
        UserManager<SMSUser> userManager,
        SignInManager<SMSUser> signInManager,
        RoleManager<SMSRole> roleManager,
        IConfiguration configuration) : base()
    {
        this.userManager = userManager;
        this.signInManager = signInManager;
        this.roleManager = roleManager;
        this.configuration = configuration;
    }


    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesDefaultResponseType]
    public async Task<ActionResult<LoginRes>> Login(LoginDto loginDto, string returnUrl = null)
    {
        returnUrl = returnUrl ?? Url.Content("~/");
        var user = await userManager.FindByEmailAsync(loginDto.Email);

        if (user == null)
        {
            return BadRequest();
        }

        if (user.IsDeactivated || IsLockedOut(user))
        {
            return BadRequest(new LoginRes(false, false, true));
        }

        var result = await signInManager.PasswordSignInAsync(loginDto.Email, loginDto.Password, false, true);

        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
                return BadRequest(new LoginRes(false, false, true));

            if (result.RequiresTwoFactor)
            {
                await userManager.UpdateSecurityStampAsync(user);
                var token = await this.userManager.GenerateTwoFactorTokenAsync(user, "Email");

                await mediator.Send(new CreateEmailNotificationCommand()
                {
                    Notification = new EmailNotification()
                    {
                        ToEmail = user.Email,
                        ToName = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                        EmailType = EmailType.AuthenticationCode,
                        Subject = "Sign in Verification Code",
                        Model = new
                        {
                            Name = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                            Code = token
                        }
                    }
                });

                return BadRequest(new LoginRes(false, true, false));
            }

            return BadRequest(new LoginRes(false));

        }

        await SignInAsync(user);

        return Ok(new LoginRes(true));
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> ForgotPassword(ForgotPasswordPayload payload)
    {
        if (string.IsNullOrWhiteSpace(payload.email?.Trim())) return BadRequest();
        var email = payload.email.Trim();

        var user = await userManager.FindByEmailAsync(email);
        if (user == null || IsLockedOut(user)) return BadRequest();

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var _token = WebUtility.UrlEncode(token);
        var clientAppUrl = new UriBuilder(configuration.GetValue<string>("appUrl"))
        {
            Path = "forgot-password",
            Query = string.Join("&", new List<string> { $"token={WebUtility.UrlEncode(token)}", $"email={WebUtility.UrlEncode(user.Email)}" })
        };
        var url = clientAppUrl.Uri.AbsoluteUri;
        await mediator.Send(new CreateEmailNotificationCommand()
        {
            Notification = new EmailNotification()
            {
                ToEmail = user.Email,
                ToName = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                EmailType = EmailType.ForgotPassword,
                Subject = "Forgot Password",
                Model = new
                {
                    Name = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                    Url = url
                }
            }
        });

        return Ok();
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> ResetPassword(ResetPasswordPayload payload)
    {
        var email = payload.Email?.Trim();
        var token = payload.Token?.Trim();
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(token)) return BadRequest();

        var user = await userManager.FindByEmailAsync(email);
        if (user == null || IsLockedOut(user)) return BadRequest();

        var result = await userManager.ResetPasswordAsync(user, token, payload.Password);
        if (result.Succeeded) return Ok();

        var errors = result.Errors.Select(error => new { error.Code, error.Description })
       .ToDictionary(t => t.Code, t => t.Description);

        return BadRequest(errors);

    }


    [HttpPost("change-password")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> ChangePassword(ChangePasswordPayload payload)
    {
        var currentUserId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(currentUserId)) return BadRequest("Error occurred");

        var user = await userManager.FindByIdAsync(currentUserId);

        if (user == null) return BadRequest("Error occurred");

        var result = await userManager.ChangePasswordAsync(user, payload.CurrentPassword, payload.NewPassword);

        if (result.Succeeded)
        {

            await mediator.Send(new CreateEmailNotificationCommand()
            {
                Notification = new EmailNotification()
                {
                    ToEmail = user.Email,
                    ToName = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                    EmailType = EmailType.PasswordChanged,
                    Subject = "Your SMS account password was changed",
                    Model = new
                    {
                        Name = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                    }
                }
            });
            return Ok();
        };

        var errors = result.Errors.Select(error => new { error.Code, error.Description })
        .ToDictionary(t => t.Code, t => t.Description);

        return BadRequest(errors);
    }

    [HttpPost("deactivate-user")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = AuthPolicy.CanCreateOrUpdateUser)]
    public async Task<ActionResult> DeactivateUser([FromBody] UserEmail payload)
    {
        if (string.IsNullOrWhiteSpace(payload.Email)) return BadRequest();

        var user = await userManager.FindByEmailAsync(payload.Email);

        if (user == null) return BadRequest();

        user.IsDeactivated = true;
        user.LockoutEnd = DateTimeOffset.MaxValue;

        await userManager.UpdateAsync(user);

        return Ok();
    }

    [HttpPost("activate-user")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = AuthPolicy.CanCreateOrUpdateUser)]
    public async Task<ActionResult> ActivateUser([FromBody] UserEmail payload)
    {
        if (string.IsNullOrWhiteSpace(payload.Email)) return BadRequest();

        var user = await userManager.FindByEmailAsync(payload.Email);

        if (user == null) return BadRequest();

        user.IsDeactivated = false;
        user.LockoutEnd = null;

        await userManager.UpdateAsync(user);

        return Ok();
    }



    [HttpPost("verification-code")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [AllowAnonymous]
    public async Task<ActionResult> VerificationCode([FromBody] VerificationCode VerificationCode)
    {
        if (string.IsNullOrWhiteSpace(VerificationCode?.Code)) return BadRequest();

        var result = await signInManager.TwoFactorSignInAsync("Email", VerificationCode.Code, false, false);

        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
            {
                return BadRequest(new LoginRes(false, false, true));
            }
            return BadRequest(new LoginRes(false, true, false));
        }

        var user = await signInManager.GetTwoFactorAuthenticationUserAsync();
        await SignInAsync(user);
        return Ok(new LoginRes(true));
    }

    [HttpPost("logout")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok();
    }

    private ClaimsIdentity GetClaimIdentity(SMSUser user, List<Claim> userClaims)
    {
        var claimsIdentity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);

        var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user?.FirstName  ??""),
                new Claim("middle_name", user?.MiddleName ??""),
                new Claim(ClaimTypes.Surname, user?.LastName ??""),
                new Claim(ClaimTypes.Email, user?.Email ??"")
            };
        claimsIdentity.AddClaims(claims);

        if (userClaims?.Count() > 0)
        {
            claimsIdentity.AddClaims(userClaims);
        }

        return claimsIdentity;
    }

    private async Task SignInAsync(SMSUser user)
    {
        var claims = (await userManager.GetClaimsAsync(user))?.ToList();
        var roles = await userManager.GetRolesAsync(user);

        foreach (var roleName in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, roleName));
            var role = await roleManager.FindByNameAsync(roleName);
            if (role != null)
                claims.AddRange(await roleManager.GetClaimsAsync(role));

        }
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(GetClaimIdentity(user, claims ?? new List<Claim>())));

        logger.LogInformation("User {Email} ({FirstName} {MiddleName} {LastName}) logged in at {Time}.",
            user.Email, user.FirstName ?? "", user.MiddleName ?? "", user.LastName ?? "", DateTime.Now);
    }

    private bool IsLockedOut(SMSUser user) => user.IsDeactivated || (user.LockoutEnd != null && user.LockoutEnd >= DateTime.UtcNow);

}
