
namespace SMS.Domain;

public class Branch : IEntity
{
    public int Id { get; set; }
    public int DistrictId { get; set; }
    public string BranchName { get; set; }
    public string BranchCode { get; set; }
    public string? BranchShareGL { get; set; }
    public bool? IsHeadOffice { get; set; } = false;
}
