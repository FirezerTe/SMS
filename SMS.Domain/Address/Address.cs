using SMS.Domain.Lookups;

namespace SMS.Domain
{
    public class Address : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public string City { get; set; }
        public string SubCity { get; set; }
        public string Kebele { get; set; }
        public string Woreda { get; set; }

        public string HouseNumber { get; set; }

        public int ShareholderId { get; set; }

        public Country Country { get; set; }

        public Shareholder Shareholder { get; set; }
    }
}
