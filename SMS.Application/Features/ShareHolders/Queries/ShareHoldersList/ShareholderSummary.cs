using SMS.Domain.Enums;
using SMS.Domain;

namespace SMS.Application
{
    public class ShareholderSummary
    {
        public int Id { get; set; }
        public Guid VersionNumber { get; set; }
        public string DisplayName { get; set; }
        public string AmharicDisplayName { get; set; }
        public Gender Gender { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public int CountryOfCitizenship { get; set; }
        public bool? EthiopianOrigin { get; set; }


        public ShareholderType Type { get; set; }

        public string? AccountNumber { get; set; }
        public ShareholderStatusEnum ShareholderStatus { get; set; }
        public ShareholderStatus Status { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public bool IsCurrent { get; set; }
        public string? TinNumber { get; set; }
        public string? FileNumber { get; set; }
        public bool IsNew { get; set; }
        public bool HasActiveTransfer { get; set; }
        public string? PhotoId { get; set; }
        public string? PhotoUrl { get; set; }
    }
}
