using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class ExpiredShareSubscriptionReportDto
    {
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }
        [JsonPropertyName("fromDate")]
        public string FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public string ToDate { get; set; }

        [JsonPropertyName("totalExpiredAmount")]
        public decimal TotalExpiredAmount { get; set; }

        [JsonPropertyName("expiredSubscriptions")]
        public List<ExpiredShareSubscriptionDto> ExpiredSubscriptions { get; set; } = new List<ExpiredShareSubscriptionDto>();

    }
    public class ExpiredShareSubscriptionDto
    {
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }
        [JsonPropertyName("sequence")]
        public int sequence { get; set; }

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

        [JsonPropertyName("expiredAmount")]
        public decimal ExpiredAmount { get; set; }

        [JsonPropertyName("totalPayment")]
        public decimal TotalPayment { get; set; }

        [JsonPropertyName("subscriptionPaidup")]
        public decimal SubscriptionPaidup { get; set; }

        [JsonPropertyName("subscriptionDate")]
        public string SubscriptionDate { get; set; }

        [JsonPropertyName("dueDate")]
        public string DueDate { get; set; }

        [JsonPropertyName("premiumPaymentReceiptNo")]
        public string PremiumPaymentReceiptNo { get; set; }

        [JsonPropertyName("workflowComment")]
        public string WorkflowComment { get; set; }

    }
}