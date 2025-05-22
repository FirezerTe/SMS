namespace SMS.Domain;


public record DividendDecisionUpdated(DividendDecision decision) : IDomainEvent;

