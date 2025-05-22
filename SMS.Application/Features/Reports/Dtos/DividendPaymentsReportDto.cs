using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports
{
    public class DividendPaymentDto
    {
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("paymentAmount")]
        public double PaymentAmount { get; set; }

        [JsonPropertyName("paymentDate")]
        public string PaymentDate { get; set; }

        [JsonPropertyName("remark")]
        public string Remark { get; set; }

    }

    public class DividendPaymentsReportDto
    {
        [JsonPropertyName("fromDate")]
        public string FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public string ToDate { get; set; }

        [JsonPropertyName("payments")]
        public List<DividendPaymentDto> Payments { get; set; } = new List<DividendPaymentDto>();
    }
}
