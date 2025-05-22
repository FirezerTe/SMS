namespace SMS.Domain;

public record ContactCreatedEvent(Contact Contact) : IDomainEvent;
public record ContactUpdatedEvent(Contact Contact) : IDomainEvent;
