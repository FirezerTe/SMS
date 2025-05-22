using Hangfire;
using Hangfire.SqlServer;
using Serilog;
using SMS.BackgroundJob.Processor;
using SMS.Common;
using SMS.Persistence;
using SMS.BackgroundJob;

var builder = Host.CreateDefaultBuilder(args);

builder.UseWindowsService(options =>
   {
       options.ServiceName = "SMS Background Service";
   });

builder.UseSerilog((
    HostBuilderContext context,
    IServiceProvider services,
    LoggerConfiguration loggerConfiguration) =>
            {
                loggerConfiguration
                .ReadFrom.Configuration(context.Configuration).ReadFrom
                         .Services(services);
            });

builder.ConfigureServices((ctx, services) =>
{
    services.AddMediatR(config =>
    {
        config.RegisterServicesFromAssembly(typeof(UserService).Assembly);
    });
    services.AddSingleton<IUserService, UserService>();

    services.AddBackgroundSchedulerService();
    services.AddCommonServices(ctx.Configuration);
    services.AddPersistenceService(ctx.Configuration);
    var connectionString = ctx.Configuration.GetConnectionString("SMSConnectionString");

    services.AddHangfire(configuration => configuration
         .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
         .UseSimpleAssemblyNameTypeSerializer()
         .UseRecommendedSerializerSettings()
         .UseSqlServerStorage(connectionString, new SqlServerStorageOptions
         {
             CommandTimeout = TimeSpan.FromMinutes(5)
         }));

    services.AddHangfireServer();
});

var host = builder.Build();

GlobalJobFilters.Filters.Add(new EmailFailedJobsAttribute(host.Services));


await host.RunAsync();

