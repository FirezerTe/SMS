using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class PaidUpSummeryByShareholderDto
    {
        [JsonPropertyName("shareHolderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("totalPayments")]
        public double TotalPayments { get; set; }
        [JsonPropertyName("totalShareValue")]
        public double TotalShareValue { get; set; }
    }
    public class PaidUpSummeryByShareholderDtoReportDto
    {

        [JsonPropertyName("toDate")]
        public string? ToDate { get; set; }
        [JsonPropertyName("count")]
        public int? Count { get; set; }

        [JsonPropertyName("totalPaymentAmount")]
        public double? TotalPaymentAmount { get; set; }
        [JsonPropertyName("totalNoOfShares")]
        public double? TotalNoOfShares { get; set; }

        [JsonPropertyName("paymentsTotal")]
        public List<PaidUpSummeryByShareholderDto> PaymentsTotal { get; set; } = new List<PaidUpSummeryByShareholderDto>();
    }
}