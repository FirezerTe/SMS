using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class EndOfDayDailyReportDto
    {
        [JsonPropertyName("fromDate")]
        public DateOnly FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public DateOnly ToDate { get; set; }

        [JsonPropertyName("endOfDayResponse")]
        public List<EndOfDayResponseDto> EndOfDayResponse { get; set; } = new List<EndOfDayResponseDto>();
        [JsonPropertyName("endOfDayDetail")]
        public List<EndOfDayDetailDto> EndOfDayDetail { get; set; } = new List<EndOfDayDetailDto>();
    }
    public class EndOfDayDetailDto
    {
        [JsonPropertyName("batchNumber")]
        public string? BatchNumber { get; set; }

        [JsonPropertyName("glAccountNumber")]
        public string? GLAccount { get; set; }

        [JsonPropertyName("amount")]
        public decimal? Amount { get; set; }

        [JsonPropertyName("responseMessage")]
        public string? ResponseMessage { get; set; }
        [JsonPropertyName("transactionType")]
        public string? TransactionType { get; set; }

        [JsonPropertyName("isSuccess")]
        public string? IsSuccess { get; set; }
        [JsonPropertyName("postingDate")]
        public DateOnly? PostingDate { get; set; }
    }
    public class EndOfDayResponseDto
    {
        [JsonPropertyName("batchNumber")]
        public string? BatchNumber { get; set; }

        [JsonPropertyName("isSuccess")]
        public bool? IsSuccess { get; set; }

        [JsonPropertyName("responseMessage")]
        public string? ResponseMessage { get; set; }
        [JsonPropertyName("responseCode")]
        public string? ResponseCode { get; set; }
        [JsonPropertyName("postingDate")]
        public DateOnly? PostingDate { get; set; }
        [JsonPropertyName("CreatedDate")]
        public DateOnly? CreatedDate { get; set; }

    }
}