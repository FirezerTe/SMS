using SMS.Common;
using System.Security.Claims;

namespace SMS.Api.Services;

public class UserService : IUserService
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public UserService(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }
    public string GetCurrentUserId()
    {
        return httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    public string GetCurrentUserFullName()
    {
        var firstName = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Name);
        var middleName = httpContextAccessor.HttpContext?.User?.FindFirstValue("middle_name");
        var lastName = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Surname);

        return $"{firstName ?? ""} {middleName ?? ""} {lastName ?? ""}";
    }
}
