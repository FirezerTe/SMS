namespace SMS.Domain;


public record TransferAddedEvent(Transfer Transfer) : IDomainEvent;
public record TransferUpdatedEvent(Transfer Transfer) : IDomainEvent;

