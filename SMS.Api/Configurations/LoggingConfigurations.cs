using Serilog;

namespace SMS.Api.Configurations
{
    public static class LoggingConfigurations
    {
        public static IHostBuilder UseLoggingConfigurations(this IHostBuilder hostBuilder)
        {
            hostBuilder.UseSerilog(
                (HostBuilderContext context,
                IServiceProvider services,
                LoggerConfiguration loggerConfiguration) =>
                {
                    loggerConfiguration
                    .ReadFrom.Configuration(context.Configuration)
                    .ReadFrom.Services(services);
            });
            return hostBuilder;
        }
    }
}
