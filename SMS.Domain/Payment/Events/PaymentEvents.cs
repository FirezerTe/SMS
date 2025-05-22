using SMS.Domain.Enums;

namespace SMS.Domain;

public record PaymentAddedEvent(Payment Payment) : IDomainEvent;
public record PaymentUpdatedEvent(Payment Payment, ApprovalStatus previousApprovalStatus) : IDomainEvent;