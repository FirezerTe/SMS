namespace SMS.Domain.Lookups
{
    public class Country : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Nationality { get; set; }
        public int DisplayOrder { get; set; }

    }
}
