namespace SMS.Application;

public class ParValueDto : WorkflowEnabledEntityDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
}
