using System.ComponentModel.DataAnnotations.Schema;

namespace SMS.Domain
{
    [NotMapped]
    public class RepresentativeAddress
    {
        public int CountryId { get; set; }
        public string City { get; set; }
        public string SubCity { get; set; }
        public string Kebele { get; set; }
        public string Woreda { get; set; }
        public string HouseNumber { get; set; }
    }
}
