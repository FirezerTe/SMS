using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class BankAllocationReportDtos
    {
        [JsonPropertyName("fromDate")]
        public DateOnly FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public DateOnly ToDate { get; set; }

        [JsonPropertyName("bankAllocations")]
        public List<BankAllocationsDto> BankAllocations { get; set; } = new List<BankAllocationsDto>();

    }
    public class BankAllocationsDto
    {
        [JsonPropertyName("sequence")]
        public int Sequence { get; set; }
        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }


        [JsonPropertyName("name")]
        public string BankAllocationName { get; set; }

        [JsonPropertyName("maxPercentagePurchaseLimit")]
        public decimal? MaxPercentagePurchaseLimit { get; set; }
        [JsonPropertyName("description")]
        public string Deacription { get; set; }
        [JsonPropertyName("createdAt")]
        public string? CreatedAt { get; set; }

    }
}