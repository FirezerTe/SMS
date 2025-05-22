namespace SMS.Domain;

public record ShareholderBlocked(Shareholder Shareholder) : IDomainEvent;
