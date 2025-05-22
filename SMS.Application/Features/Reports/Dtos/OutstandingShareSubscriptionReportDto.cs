using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class OutstandingShareSubscriptionReportDto
    {
        [JsonPropertyName("fromDate")]
        public string FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public string ToDate { get; set; }


        [JsonPropertyName("totalOutstandingSubscription")]
        public decimal TotalOutstandingSubscription { get; set; }


        [JsonPropertyName("outstandingShareSubscriptions")]
        public List<OutstandingShareSubscriptionDto> OutstandingShareSubscriptions { get; set; } = new List<OutstandingShareSubscriptionDto>();

    }
    public class OutstandingShareSubscriptionDto
    {
        [JsonPropertyName("sequence")]
        public int sequence { get; set; }
        [JsonPropertyName("subscriptionShareHolderID")]
        public int ShareholderID { get; set; }

        [JsonPropertyName("subscriptionShareHolderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("subscriptionDate")]
        public string SubscriptionDate { get; set; }
        [JsonPropertyName("subscriptionAmount")]
        public decimal SubscriptionAmount { get; set; }
        [JsonPropertyName("subscriptionPaidUpAmount")]
        public decimal SubscriptionPaidUpAmount { get; set; }

        [JsonPropertyName("subscriptionOutstandingAmount")]
        public decimal SubscriptionOutstandingAmount { get; set; }

        [JsonPropertyName("subscriptionRemark")]
        public string SubscriptionRemark { get; set; }

    }
}