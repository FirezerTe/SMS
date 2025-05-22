namespace SMS.Application.Features.Allocation.Models
{
    public class AllocationListResponse
    {
        public int TotalItems { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public List<AllocationInfo> AllocationList { get; set; }
    }
}
