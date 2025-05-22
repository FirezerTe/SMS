using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using SMS.Application;
using SMS.Infrastructure;
using SMS.Persistence;
using SMS.Api.Configurations;
using SMS.Api;
using Hangfire;
using SMS.Api.Services;
using System.Text.Json.Serialization;
using SMS.Api.Filters;
using SMS.BackgroundJob;
using SMS.Common;


var builder = WebApplication.CreateBuilder(args);

builder.Host.UseLoggingConfigurations();

builder.Services.AddProblemDetails(config =>
{
});

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddScoped<ApiExceptionFilterAttribute>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpClient();

builder.Services.AddEndpointsApiExplorer()
    .AddSwagger()
    .AddCommonServices(builder.Configuration)
    .AddApplicationServices()
    .AddBackgroundSchedulerService()
    .AddInfrastructureService()
    .AddPersistenceService(builder.Configuration)
    .UseHangfireConfigurations(builder.Configuration)
    .AddScoped<HttpContextAccessor>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger()
        .UseSwaggerUI();
    await DataSeeder.SeedData(app);
}

app.UseAuthentication();
app.UseAuthorization();

app.MapHangfireDashboard("/jobs", new DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter() },
    DashboardTitle = "SMS Background Jobs"
});



//app.UseHttpsRedirection();
app.MapControllers();

using (var serviceScope = app.Services.CreateScope())
{
    var services = serviceScope.ServiceProvider;

    var jobService = services.GetRequiredService<IBackgroundRecurringJobsScheduler>();
    jobService.RemoveAll();
    jobService.ScheduleAll();
}

app.Run();
