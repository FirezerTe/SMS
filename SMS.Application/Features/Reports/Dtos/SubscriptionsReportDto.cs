using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports
{
    public class SubscriptionDto
    {
        [JsonPropertyName("sequenceNumber")]
        public int SequenceNumber { get; set; }
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }
        [JsonPropertyName("subscriptionGroupID")]
        public int SubscriptionGroupID { get; set; }

        [JsonPropertyName("subscriptionGroup")]
        public string SubscriptionGroup { get; set; }


        [JsonPropertyName("subscriptionOriginalReferenceNo")]
        public string SubscriptionOriginalReferenceNo { get; set; }

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }
        [JsonPropertyName("share")]
        public decimal Share { get; set; }

        [JsonPropertyName("subscriptionPaidup")]
        public decimal SubscriptionPaidup { get; set; }

        [JsonPropertyName("subscriptionDate")]
        public string SubscriptionDate { get; set; }

        [JsonPropertyName("premiumPaymentReceiptNo")]
        public string PremiumPaymentReceiptNo { get; set; }

        [JsonPropertyName("premiumPayment")]
        public decimal? PremiumPayment { get; set; }

        [JsonPropertyName("workflowComment")]
        public string WorkflowComment { get; set; }

    }

    public class SubscriptionsReportDto
    {
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }
        [JsonPropertyName("fromDate")]
        public string FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public string ToDate { get; set; }

        [JsonPropertyName("subscriptions")]
        public List<SubscriptionDto> Subscriptions { get; set; } = new List<SubscriptionDto>();

    }
}