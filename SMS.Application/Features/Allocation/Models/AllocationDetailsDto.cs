using SMS.Domain.Enums;

namespace SMS.Application;

public class AllocationDto : AllocationInfo
{
    public ApprovalStatus ApprovalStatus { get; set; }
    public string? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? SubmittedBy { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public string? RejectedBy { get; set; }
    public DateTime? RejectedAt { get; set; }
    public Guid VersionNumber { get; set; } = Guid.NewGuid();
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public string? WorkflowComment { get; set; }
    public bool IsDividendAllocation { get; set; } = false;


}
