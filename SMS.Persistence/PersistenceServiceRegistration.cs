using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SMS.Application;
using SMS.Common;
using SMS.Persistence.Interceptors;
using SMS.Persistence.Repositories;

namespace SMS.Persistence;

public static class PersistenceServiceRegistration
{
    public static IServiceCollection AddPersistenceService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<PublishDomainEventsInterceptor>();
        services.AddScoped<AuditableEntitySaveChangesInterceptor>();

        services.AddDbContext<SMSDbContext>(item => item.UseSqlServer(configuration.GetConnectionString("SMSConnectionString"),
        options =>
        {
            if (configuration.GetValue<bool>("IsBackgroundJob"))
                options.CommandTimeout((int)TimeSpan.FromMinutes(30).TotalMilliseconds);
        }));


        services.AddScoped<IUserRepository, UserRepository>();

        // services.AddScoped<IdentityDbContext<SMSUser, SMSRole, string>, SMSDbContext>();

        services.AddScoped<IDataService, SMSDbContext>();

        return services;
    }
}
