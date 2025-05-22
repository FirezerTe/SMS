namespace SMS.Api.Dtos;

public class AllocationRequest
{
    public int SubscriptionID { get; set; }
    public string Allocate_Status { get; set; }
    public int Allocation_Amount { get; set; }
    public string Allocation_Desc { get; set; }
    public int Remaining_Amt { get; set; }
    public int Pending_Amt { get; set; }
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public int AllocationID { get; set; }
    public DateTime AllocateDate { get; set; }
    public decimal AllocateAmount { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string AllocateDescription { get; set; }
}
