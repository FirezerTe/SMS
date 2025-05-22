using Hangfire;

namespace SMS.Api.Configurations
{
    public static class HangfireConfigurations
    {
        public static IServiceCollection UseHangfireConfigurations(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("SMSConnectionString");
            services.AddHangfire(configuration =>
                    configuration.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                                 .UseSimpleAssemblyNameTypeSerializer()
                                 .UseRecommendedSerializerSettings()
                                 .UseSqlServerStorage(connectionString));

            return services;
        }
    }
}
