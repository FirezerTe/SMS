using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using SMS.Application;
using SMS.Application.Security;
using SMS.Domain.User;
using SMS.Infrastructure.Document;
using SMS.Infrastructure.Identity;
using SMS.Persistence;

namespace SMS.Infrastructure;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureService(this IServiceCollection services)
    {
        services.AddScoped<IDocumentUploadService, DocumentUploadService>();
        services.AddTransient<IIdentityService, IdentityService>();

        _ = services.AddIdentity<SMSUser, SMSRole>(options =>
        {
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 8;
            options.User.RequireUniqueEmail = true;

            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(2);
            options.Lockout.MaxFailedAccessAttempts = 5;


        })
        .AddRoles<SMSRole>()
        .AddEntityFrameworkStores<SMSDbContext>()
        .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;// JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;// JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;// JwtBearerDefaults.AuthenticationScheme;
        })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.Cookie.Name = "auth";
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Events.OnRedirectToLogin = (context) =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToAccessDenied = (context) =>
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                };
                options.ExpireTimeSpan = TimeSpan.FromHours(8);
            });

        services.AddAuthorization(options =>
        {
            //Allocation
            options.AddPolicy(AuthPolicy.CanApproveAllocation, policy => policy.RequireRole(Roles.ShareUnitDirector));
            options.AddPolicy(AuthPolicy.CanCreateOrUpdateAllocation, policy => policy.RequireRole(Roles.ShareUnitSectionHead));
            options.AddPolicy(AuthPolicy.CanCreateOrUpdateBankAllocation, policy => policy.RequireRole(Roles.ShareUnitSectionHead));
            options.AddPolicy(AuthPolicy.CanApproveBankAllocation, policy => policy.RequireRole(Roles.ShareUnitDirector));

            //Dividend Setup
            options.AddPolicy(AuthPolicy.CanCreateOrUpdateDividendSetup, policy => policy.RequireRole(Roles.ShareUnitSectionHead, Roles.ShareUnitDirector));
            options.AddPolicy(AuthPolicy.CanApproveDividendSetup, policy => policy.RequireRole(Roles.ShareUnitDirector, Roles.ShareUnitSectionHead));

            //ParValue
            options.AddPolicy(AuthPolicy.CanApproveParValue, policy => policy.RequireRole(Roles.ShareUnitDirector, Roles.ShareUnitSectionHead));
            options.AddPolicy(AuthPolicy.CanCreateOrUpdateParValue, policy => policy.RequireRole(Roles.ShareUnitDirector, Roles.ShareUnitSectionHead));

            //Subscription Group
            options.AddPolicy(AuthPolicy.CanCreateOrUpdateSubscriptionGroup, policy => policy.RequireRole(Roles.ShareUnitDirector, Roles.ShareUnitSectionHead));

            //Shareholder
            options.AddPolicy(AuthPolicy.CanCreateOrUpdateShareholderInfo, policy => policy.RequireRole(Roles.ShareOfficer));
            options.AddPolicy(AuthPolicy.CanSubmitShareholderApprovalRequest, policy => policy.RequireRole(Roles.ShareOfficer));
            options.AddPolicy(AuthPolicy.CanApproveShareholder, policy => policy.RequireRole(Roles.ShareUnitDirector, Roles.ShareUnitSectionHead));

            //Subscription
            options.AddPolicy(AuthPolicy.CanCreateOrUpdateSubscription, policy => policy.RequireRole(Roles.ShareOfficer));

            //Payment
            options.AddPolicy(AuthPolicy.CanCreateOrUpdatePayment, policy => policy.RequireRole(Roles.ShareOfficer));

            //Transfer
            options.AddPolicy(AuthPolicy.CanCreateOrUpdateTransfer, policy => policy.RequireRole(Roles.ShareOfficer));

            //admin
            options.AddPolicy(AuthPolicy.CanCreateOrUpdateUser, policy => policy.RequireRole(Roles.ITAdmin));

            //endofday
            options.AddPolicy(AuthPolicy.CanProcessEndOfDay, policy => policy.RequireRole(Roles.ShareUnitSectionHead, Roles.ITAdmin));
        });

        return services;
    }
}
