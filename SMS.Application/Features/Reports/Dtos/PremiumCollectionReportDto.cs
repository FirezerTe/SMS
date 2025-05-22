using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class PremiumCollectionReportDto
    {
        [JsonPropertyName("fromDate")]
        public string FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public string ToDate { get; set; }

        [JsonPropertyName("totalPremiumCollected")]
        public decimal TotalPremiumCollect { get; set; }

        [JsonPropertyName("premiumCollection")]
        public List<PremiumCollectionDto> premiumCollection { get; set; } = new List<PremiumCollectionDto>();

    }
    public class PremiumCollectionDto
    {
        [JsonPropertyName("sequence")]
        public int Sequence { get; set; }
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }


        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("totalCollected")]
        public decimal TotalPremium { get; set; }

        [JsonPropertyName("premiumPayment")]
        public decimal? PremiumPayment { get; set; }

        [JsonPropertyName("subscriptionDate")]
        public string SubscriptionDate { get; set; }


    }
}