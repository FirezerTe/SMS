namespace SMS.Domain.Lookups
{
    public class District : IEntity
    {
        public int Id { get; set; }
        public string DistrictName { get; set; }
        public string DistrictCode { get; set; }
    }
}