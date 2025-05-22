using SMS.Domain.Enums;

namespace SMS.Application
{
    public record ApprovalStatusTransition(ApprovalStatus From, ApprovalStatus To);
}
