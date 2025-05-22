using SMS.Domain.Enums;

namespace SMS.Domain;

public abstract class WorkflowEnabledEntity : AuditableEntity, IEntity
{
    public int Id { get; set; }

    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    public string? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }

    public string? SubmittedBy { get; set; }
    public DateTime? SubmittedAt { get; set; }

    public string? RejectedBy { get; set; }
    public DateTime? RejectedAt { get; set; }

    public string? WorkflowComment { get; set; }

    public Guid VersionNumber { get; set; } = Guid.NewGuid();

    public bool SkipStateTransitionCheck { get; set; } = false;
    private readonly List<IDomainEvent> domainEvents = new();
    public IReadOnlyList<IDomainEvent> DomainEvents => domainEvents.AsReadOnly();

    public void AddDomainEvent(IDomainEvent @event)
    {
        domainEvents.Add(@event);
    }

    public void ClearDomainEvents()
    {
        domainEvents.Clear();
    }
}
