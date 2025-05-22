namespace SMS.Application;

public class FamilyDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<ShareholderBasicInfo> Members { get; set; }
}
