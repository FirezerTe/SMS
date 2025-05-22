namespace SMS.Domain;

public record SubscriptionAddedEvent(Subscription Subscription) : IDomainEvent;
public record SubscriptionUpdatedEvent(Subscription Subscription) : IDomainEvent;
