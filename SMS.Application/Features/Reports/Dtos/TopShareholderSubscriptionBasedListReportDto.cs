using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class TopShareholderSubscriptionBasedListReportDto
    {
        [JsonPropertyName("topSubscription")]
        public decimal TopSubscription { get; set; }


        [JsonPropertyName("topShareholderSubscriptions")]
        public List<TopShareholderSubscriptionsDto> TopShareholderSubscriptions { get; set; } = new List<TopShareholderSubscriptionsDto>();

    }
    public class TopShareholderSubscriptionsDto
    {
        [JsonPropertyName("subscriptionShareHolderID")]
        public int ShareholderID { get; set; }

        [JsonPropertyName("sequenceNumber")]
        public int SequenceNumber { get; set; }
        [JsonPropertyName("subscriptionShareHolderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("subscriptionDate")]
        public string SubscriptionDate { get; set; }
        [JsonPropertyName("subscriptionAmount")]
        public decimal SubscriptionAmount { get; set; }
        [JsonPropertyName("share")]
        public decimal Share { get; set; }

        [JsonPropertyName("subscriptionRemark")]
        public string SubscriptionRemark { get; set; }

    }
}