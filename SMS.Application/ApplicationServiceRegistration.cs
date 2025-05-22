using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using SMS.Application.PipelineBehaviors;
using SMS.Domain;
using System.Reflection;

namespace SMS.Application;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(typeof(IDomainEvent).Assembly);
        services.AddValidatorsFromAssembly(typeof(ApproveShareholderCommand).Assembly);
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IDividendService, DividendService>();
        services.AddScoped<IShareholderChangeLogService, ShareholderChangeLogService>();

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(ApproveShareholderCommand).Assembly);
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehavior<,>));
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehavior<,>));
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        });

        return services;
    }
}
