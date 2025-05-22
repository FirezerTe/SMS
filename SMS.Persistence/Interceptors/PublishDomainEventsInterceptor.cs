using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SMS.Domain;

namespace SMS.Persistence;

public class PublishDomainEventsInterceptor : SaveChangesInterceptor
{
    private readonly IMediator mediator;

    public PublishDomainEventsInterceptor(IMediator mediator)
    {
        if (mediator is null)
        {
            throw new ArgumentNullException(nameof(mediator));
        }

        this.mediator = mediator;
    }
    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        PublishDomainEvents(eventData.Context).GetAwaiter().GetResult();
        return base.SavingChanges(eventData, result);
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        await PublishDomainEvents(eventData.Context);
        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private async Task PublishDomainEvents(DbContext? context)
    {
        if (context == null) return;

        var entitiesWithDomainEvents = context.ChangeTracker.Entries<WorkflowEnabledEntity>()
                                            .Where(entry => entry.Entity.DomainEvents.Any())
                                            .Select(entry => entry.Entity)
                                            .ToList();


        var flattenedDomainEvents = entitiesWithDomainEvents.SelectMany(entry => entry.DomainEvents).ToList();
        entitiesWithDomainEvents.ForEach(entity => entity.ClearDomainEvents());

        foreach (var domainEvent in flattenedDomainEvents)
        {
            await mediator.Publish(domainEvent);
        }

    }
}
