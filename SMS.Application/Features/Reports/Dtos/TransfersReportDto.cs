using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports
{
    public class TransferDto
    {
        [JsonPropertyName("fromShareholderId")]
        public int FromShareholderId { get; set; }

        [JsonPropertyName("fromShareholderName")]
        public string FromShareholderName { get; set; }

        [JsonPropertyName("toShareholderId")]
        public int ToShareholderId { get; set; }

        [JsonPropertyName("toShareholderName")]
        public string ToShareholderName { get; set; }

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("numberOfShares")]
        public int NumberOfShares { get; set; }

        [JsonPropertyName("transferDate")]
        public string TransferDate { get; set; }

        [JsonPropertyName("transferType")]
        public string TransferType { get; set; }

        [JsonPropertyName("dividendTerm")]
        public string DividendTerm { get; set; }
    }

    public class TransfersReportDto
    {
        [JsonPropertyName("fromDate")]
        public string FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public string ToDate { get; set; }

        [JsonPropertyName("totalTransferAmount")]
        public decimal TotalTransferAmount { get; set; }

        [JsonPropertyName("totalShare")]
        public decimal TotalShare { get; set; }


        [JsonPropertyName("transfers")]
        public List<TransferDto> Transfers { get; set; } = new List<TransferDto>();
    }
}
