using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports
{
    public class ShareholderPaymentDto
    {
        [JsonPropertyName("referenceNumber")]
        public string ReferenceNumber { get; set; }

        [JsonPropertyName("paymentType")]
        public string PaYmentType { get; set; }

        [JsonPropertyName("paymentInBirr")]
        public double PaymentInBirr { get; set; }

        [JsonPropertyName("paymentInShares")]
        public int PaymentInShares { get; set; }

        [JsonPropertyName("paymentDate")]
        public string PaymentDate { get; set; }

        [JsonPropertyName("receiptNo")]
        public string ReceiptNo { get; set; }

        [JsonPropertyName("paymentMethod")]
        public string PaymentMethod { get; set; }

        [JsonPropertyName("remark")]
        public string Remark { get; set; }

    }
    public class ShareholderPaymentsReportDto
    {
        [JsonPropertyName("totalPaidUpInBirr")]
        public double TotalPaidUpInBirr { get; set; }

        [JsonPropertyName("totalPaidUpShares")]
        public int TotalPaidUpShares { get; set; }

        [JsonPropertyName("fromDate")]
        public string FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public string ToDate { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("payments")]
        public List<ShareholderPaymentDto> Payments { get; set; } = new List<ShareholderPaymentDto>();
    }
}