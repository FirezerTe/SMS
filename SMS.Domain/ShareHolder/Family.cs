using SMS.Domain.Common;

namespace SMS.Domain
{
    public class Family: AuditableSoftDeleteEntity
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public ICollection<ShareholderFamily> ShareholderFamilies { get; set; }
        public ICollection<Shareholder> Members { get; set; }
    }
}
