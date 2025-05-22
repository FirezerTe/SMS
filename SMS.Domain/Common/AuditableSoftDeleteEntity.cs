namespace SMS.Domain.Common
{
    public abstract class AuditableSoftDeleteEntity : AuditableEntity
    {
        public bool? IsDeleted { get; set; }
        public string? DeletedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? DeletionComment { get; set; }
    }
}
