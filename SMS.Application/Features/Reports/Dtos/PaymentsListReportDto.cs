using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports
{
    public class PaymentsListDto
    {
        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }
        [JsonPropertyName("receiptNumber")]
        public string ReceiptNumber { get; set; }

        [JsonPropertyName("paymentType")]
        public string PaymentType { get; set; }

        [JsonPropertyName("branchName")]
        public string BranchName { get; set; }

        [JsonPropertyName("branchNewShareGL")]
        public string branchNewShareGL { get; set; }

        [JsonPropertyName("paymentAmount")]
        public decimal PaymentAmount { get; set; }

        [JsonPropertyName("paymentDate")]
        public string PaymentDate { get; set; }

        [JsonPropertyName("subscriptionInfo")]
        public string SubscriptionInfo { get; set; }

    }
    public class PaymentsListReportDto
    {
        [JsonPropertyName("fromDate")]
        public string FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public string ToDate { get; set; }
        [JsonPropertyName("totalPaymentAmount")]
        public decimal TotalPaymentAmount { get; set; }

        [JsonPropertyName("payments")]
        public List<PaymentsListDto> Payments { get; set; } = new List<PaymentsListDto>();
    }
}