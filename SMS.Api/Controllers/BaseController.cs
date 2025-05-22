using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Api.Filters;
using SMS.Application.Security;
using System.Security.Claims;

namespace SMS.Api.Controllers;

[ApiController]
[ServiceFilter(typeof(ApiExceptionFilterAttribute))]
[Microsoft.AspNetCore.Authorization.Authorize]
public class BaseController<T> : ControllerBase where T : BaseController<T>
{
    private IMediator? _mediator;
    private ILogger<T>? _logger;
    private HttpContextAccessor _httpContextAccessor;
    private UserDto? _currentUser;
    private IAuthorizationService? _authorizationService;

    public static string ShortName => typeof(T).Name.Replace("Controller", "");

    protected IMediator mediator => _mediator ??=
         HttpContext.RequestServices.GetService<IMediator>();
    protected ILogger<T> logger => _logger ??=
         HttpContext.RequestServices.GetService<ILogger<T>>();

    protected HttpContextAccessor httpContextAccessor => _httpContextAccessor ??=
        HttpContext.RequestServices.GetService<HttpContextAccessor>();

    protected IAuthorizationService authorizationService => _authorizationService ??=
            HttpContext.RequestServices.GetService<IAuthorizationService>();

    public UserDto CurrentUser => _currentUser ??= GetCurrentUser();

    protected string GetDocumentUrl(string documentId)
    {
        if (documentId == null) return null;

        return Url.Action(
            action: nameof(DocumentsController.Get),
            controller: DocumentsController.ShortName,
            values: new { Id = documentId.ToString() });
    }

    protected string GetDocumentRootPath()
    {
        return Url.Action(
            action: nameof(DocumentsController.Get),
            controller: DocumentsController.ShortName,
            values: new { Id = string.Empty });
    }

    protected string GetCurrentUserId()
    {
        if (httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
        {
            var claims = httpContextAccessor.HttpContext.User.Claims;

            return claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        }
        return null;
    }

    private UserDto GetCurrentUser()
    {
        if (httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
        {
            var claims = httpContextAccessor.HttpContext.User.Claims;
            if (claims != null)
            {
                return new UserDto
                {
                    Id = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
                    FirstName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                    MiddleName = claims?.FirstOrDefault(c => c.Type == "middle_name")?.Value,
                    LastName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value,
                    Email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
                    BranchId = Convert.ToInt16(claims?.FirstOrDefault(c => c.Type == "branch_Id")?.Value),
                };
            }
        }
        return null;
    }

    protected async Task<List<Permission>> GetPermissions()
    {
        string[] policies =
        [
            AuthPolicy.CanCreateOrUpdateAllocation,
            AuthPolicy.CanApproveAllocation,
            AuthPolicy.CanCreateOrUpdateBankAllocation,
            AuthPolicy.CanApproveBankAllocation,
            AuthPolicy.CanCreateOrUpdateDividendSetup,
            AuthPolicy.CanApproveDividendSetup,
            AuthPolicy.CanCreateOrUpdateParValue,
            AuthPolicy.CanApproveParValue,
            AuthPolicy.CanCreateOrUpdateSubscriptionGroup,
            AuthPolicy.CanCreateOrUpdateShareholderInfo,
            AuthPolicy.CanSubmitShareholderApprovalRequest,
            AuthPolicy.CanApproveShareholder,
            AuthPolicy.CanCreateOrUpdateSubscription,
            AuthPolicy.CanCreateOrUpdatePayment,
            AuthPolicy.CanCreateOrUpdateTransfer,
            AuthPolicy.CanCreateOrUpdateUser,
            AuthPolicy.CanProcessEndOfDay
        ];

        var permissions = await Task.WhenAll(policies.Select(HasPolicy));
        return permissions.ToList();
    }

    private async Task<Permission> HasPolicy(string policyName)
    {
        try
        {
            var result = await authorizationService.AuthorizeAsync(User, policyName);
            return new Permission(policyName, result.Succeeded);
        }
        catch (Exception)
        {
            return new Permission(policyName, false);
        }
    }
}
