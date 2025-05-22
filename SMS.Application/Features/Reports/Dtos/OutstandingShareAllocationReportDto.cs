using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class OutstandingShareAllocationReportDto
    {
        [JsonPropertyName("fromDate")]
        public DateOnly FromDate { get; set; }

        [JsonPropertyName("totalAmount")]
        public decimal TotalAmount { get; set; }

        [JsonPropertyName("toDate")]
        public DateOnly ToDate { get; set; }

        [JsonPropertyName("outstandingAllocations")]
        public List<OutstandingAllocationsDto> OutstandingAllocations { get; set; } = new List<OutstandingAllocationsDto>();

    }
    public class OutstandingAllocationsDto
    {
        [JsonPropertyName("sequence")]
        public int Sequence { get; set; }
        [JsonPropertyName("totalAmount")]
        public decimal TotalAmount { get; set; }

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }


        [JsonPropertyName("name")]
        public string AllocationName { get; set; }

        [JsonPropertyName("fromDate")]
        public DateOnly FromDate { get; set; }


        [JsonPropertyName("toDate")]
        public DateOnly? ToDate { get; set; }

        [JsonPropertyName("allocationTotalPaidUp")]
        public decimal AllocationTotalPaidUp { get; set; }
        [JsonPropertyName("allocationRemaining")]
        public decimal AllocationRemaining { get; set; }

        [JsonPropertyName("createdAt")]
        public string? CreatedAt { get; set; }

    }
}