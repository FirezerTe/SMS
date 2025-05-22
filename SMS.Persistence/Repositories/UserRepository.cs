using Microsoft.EntityFrameworkCore;
using SMS.Application;
using SMS.Domain.User;
using System.Data;

namespace SMS.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly SMSDbContext dbContext;

    public UserRepository(SMSDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    public Task ForgetPasswordAsync()
    {
        throw new NotImplementedException();
    }

    public Task LoginAsync()
    {
        throw new NotImplementedException();
    }

    public void RegisterUser()
    {

    }
    public Task RegisterUserAsync()
    {
        throw new NotImplementedException();
    }

    public Task ResetPasswordAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<List<UserDetail>> GetAllUsers()
    {



        var result = await dbContext.Users
           .Include(u => u.Roles)
        //    .Include(u => u.Claims)
           .ToListAsync();

        var roles = await GetAllRoles();

        return result.Select(user => MapSMSUserToUserDetail(user, roles)).ToList();
    }



    public async Task<UserDetail> GetUserById(string userId)
    {
        var user = await dbContext.Users
            .Include(u => u.Roles)
            // .Include(u => u.Claims)
            .FirstOrDefaultAsync(u => u.Id == userId);

        var roles = await GetAllRoles();

        if (user == null)
            return null;

        return MapSMSUserToUserDetail(user, roles);
    }

    public async Task<List<Role>> GetAllRoles()
    {
        return await dbContext.Roles.Select(r => new Role
        {
            Id = r.Id,
            Name = r.Name,
            DisplayName = r.DisplayName,
            Description = r.Description
        }).ToListAsync();
    }

    private UserDetail MapSMSUserToUserDetail(SMSUser user, List<Role>? roles) =>
        new UserDetail
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            MiddleName = user.MiddleName,
            BranchId = user.BranchId,
            Roles = roles?.Where(r => user.Roles.Select(r => r.RoleId).Contains(r.Id)).ToList(),
            Email = user.Email,
            AccessFailedCount = user.AccessFailedCount,
            Claims = new List<Claim>(),
            IsDeactivated = user.IsDeactivated
        };
}