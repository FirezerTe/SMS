
using Microsoft.AspNetCore.Identity;
using SMS.Domain.User;
using SMS.Persistence;

namespace SMS.Api
{
    public static class DataSeeder
    {
        public static async Task<WebApplication> SeedData(WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                using (var context = scope.ServiceProvider.GetRequiredService<SMSDbContext>())
                {
                    try
                    {
                        var userManager = services.GetRequiredService<UserManager<SMSUser>>();
                        var roleManager = services.GetRequiredService<RoleManager<SMSRole>>();
                        await Seed.SeedData(context, userManager, roleManager);
                    }
                    catch (Exception ex)
                    {
                        var logger = services.GetRequiredService<ILogger<SMSDbContext>>();
                        logger.LogError(ex, "Error occurred  during migration");
                        throw;
                    }
                }
            }
            return app;
        }
    }
}

