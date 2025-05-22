using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class AllShareholdersAllocatedSubscriptionReportDto
    {
        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("AllShareholdersAllocatedSubscription")]
        public List<AllShareholdersAllocatedSubscriptionDto> AllShareholdersAllocatedSubscription { get; set; } = new List<AllShareholdersAllocatedSubscriptionDto>();

    }
    public class AllShareholdersAllocatedSubscriptionDto
    {
        [JsonPropertyName("shareholderID")]
        public int ShareholderID { get; set; }


        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("allocationID")]
        public int AllocationID { get; set; }
        [JsonPropertyName("SubscriptionAllocationAmount")]
        public decimal? SubscriptionAllocationAmount { get; set; }
        [JsonPropertyName("expireDate")]
        public DateTime? ExpireDate { get; set; }

    }
}