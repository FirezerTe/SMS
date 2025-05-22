using Microsoft.AspNetCore.Identity;
using SMS.Application.Security;
using SMS.Domain.User;
using System.Security.Claims;

namespace SMS.Persistence.SeedData;

public static class RolesAndPermisssionsSeedData
{
    public static async Task SeedAsync(RoleManager<SMSRole> roleManager)
    {
        await CreateShareOfficerRole(roleManager);
        await CreateShareAdminSectionHeadRole(roleManager);
        await CreateShareAdminDirectorRole(roleManager);
        await SystemAdminRole(roleManager);
    }

    private static async Task CreateShareOfficerRole(RoleManager<SMSRole> roleManager)
    {
        var shareOfficerRole = await roleManager.FindByNameAsync(Roles.ShareOfficer);
        if (shareOfficerRole == null)
        {
            shareOfficerRole = new SMSRole(Roles.ShareOfficer, "Officer", "Officer")
            {
                Id = Guid.NewGuid().ToString()
            };
            await roleManager.CreateAsync(shareOfficerRole);
        }

        var claims = await roleManager.GetClaimsAsync(shareOfficerRole!);

        //shareholder
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.PersonalInfo.Edit);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.BlockedStatus.Edit);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.InActiveState.Edit);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.PowerOfAttorney.Edit);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.Relatives.Edit);

        //subscription
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Subscription.Add);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Subscription.Cancel);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Subscription.Reverse);

        //payment
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Collect.Add);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Collect.Edit);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Collect.Discard);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Refund.View.Appproved);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Collect.View.Returned);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Refund.Edit);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Refund.Add);

        //Transfer
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Transfer.Add);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Transfer.update.Edit);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Transfer.Return);
        await AddClaimToRole(roleManager, shareOfficerRole, claims, CustomClaimTypes.Permission, UserPermissions.Transfer.Reverse);



    }

    private static async Task CreateShareAdminSectionHeadRole(RoleManager<SMSRole> roleManager)
    {
        var shareAdminSectionHeadRole = await roleManager.FindByNameAsync(Roles.ShareUnitSectionHead);
        if (shareAdminSectionHeadRole == null)
        {
            shareAdminSectionHeadRole = new SMSRole(Roles.ShareUnitSectionHead, "Share Unit Section Head", "Share Unit Section Head");
            shareAdminSectionHeadRole.Id = Guid.NewGuid().ToString();
            await roleManager.CreateAsync(shareAdminSectionHeadRole);
        }

        var claims = await roleManager.GetClaimsAsync(shareAdminSectionHeadRole!);

        //shareholder
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.PersonalInfo.Approve);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.PowerOfAttorney.Approve);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.BlockedStatus.Approve);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.Relatives.Approve);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Shareholder.InActiveState.Approve);


        //subscription
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Subscription.Approve);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Subscription.Returned);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Subscription.ReverseApprove);

        //payment
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Collect.Approve);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Collect.Return);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Collect.View.Pending);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Refund.View.ReversePending);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Payment.Refund.Approve);

        //allocation
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Allocation.Add);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Allocation.View.AllView);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Allocation.View.Returned);

        //Transfer
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Transfer.Approve);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Transfer.update.Edit);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Transfer.View.Pending);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Transfer.Return);
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.Transfer.ReverseApprove);

        //EndOfDay
        await AddClaimToRole(roleManager, shareAdminSectionHeadRole, claims, CustomClaimTypes.Permission, UserPermissions.EndOfDay.Process);

    }

    private async static Task SystemAdminRole(RoleManager<SMSRole> roleManager)
    {
        var systemAdminRole = await roleManager.FindByNameAsync(Roles.ITAdmin);
        if (systemAdminRole == null)
        {
            systemAdminRole = new SMSRole(Roles.ITAdmin, "IT Admin", "IT Admin");
            await roleManager.CreateAsync(systemAdminRole);
        }

        var claims = await roleManager.GetClaimsAsync(systemAdminRole!);

        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Disable);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Edit);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.Enable);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.User.View);
        await AddClaimToRole(roleManager, systemAdminRole, claims, CustomClaimTypes.Permission, UserPermissions.EndOfDay.Process);

    }

    private async static Task CreateShareAdminDirectorRole(RoleManager<SMSRole> roleManager)
    {
        var shareAdminDirectorRole = await roleManager.FindByNameAsync(Roles.ShareUnitDirector);
        if (shareAdminDirectorRole == null)
        {
            shareAdminDirectorRole = new SMSRole(Roles.ShareUnitDirector, "Share Unit Director", "Share Unit Director");
            await roleManager.CreateAsync(shareAdminDirectorRole);
        }

        var claims = await roleManager.GetClaimsAsync(shareAdminDirectorRole!);
        await AddClaimToRole(roleManager, shareAdminDirectorRole, claims, CustomClaimTypes.Permission, UserPermissions.Allocation.Approve);
        //  await AddClaimToRole(roleManager, shareAdminDirectorRole, claims, CustomClaimTypes.Permission, UserPermissions.Allocation.Edit);
        await AddClaimToRole(roleManager, shareAdminDirectorRole, claims, CustomClaimTypes.Permission, UserPermissions.Allocation.View.AllView);
        await AddClaimToRole(roleManager, shareAdminDirectorRole, claims, CustomClaimTypes.Permission, UserPermissions.Allocation.View.Pending);

    }

    private static async Task AddClaimToRole(RoleManager<SMSRole> roleManager, SMSRole shareOfficerRole, IList<Claim> currentClaims, string claimType, string value)
    {
        if (!currentClaims.Any(claim => claim.Type == claimType && claim.Value == value))
            await roleManager.AddClaimAsync(shareOfficerRole, new Claim(claimType, value));
    }
}
