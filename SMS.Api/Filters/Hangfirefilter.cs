using Hangfire.Annotations;
using Hangfire.Dashboard;
using SMS.Domain.User;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public HangfireAuthorizationFilter()
    {
    }

    public bool Authorize([NotNull] DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        return httpContext.User.Identity.IsAuthenticated && httpContext.User.IsInRole(Roles.ITAdmin);

    }
}