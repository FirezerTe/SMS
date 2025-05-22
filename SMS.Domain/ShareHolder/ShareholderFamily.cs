using SMS.Domain.Common;

namespace SMS.Domain
{
    public class ShareholderFamily : AuditableSoftDeleteEntity
    {
        public int Id { get; set; }
        public int ShareholderId { get; set; }
        public int FamilyId { get; set; }

        public Shareholder Shareholder { get; set; }
        public Family Family { get; set; }
    }
}
