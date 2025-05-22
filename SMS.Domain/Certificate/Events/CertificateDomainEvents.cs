namespace SMS.Domain;

public record CertficateCreatedEvent(Certficate Certficate) : IDomainEvent;
public record CertficateUpdatedEvent(Certficate Certficate) : IDomainEvent;
