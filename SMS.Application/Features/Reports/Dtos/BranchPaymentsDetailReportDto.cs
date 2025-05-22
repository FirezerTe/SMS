using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class BranchPaymentsDetailReportDto
    {
        [JsonPropertyName("fromDate")]
        public DateOnly FromDate { get; set; }

        [JsonPropertyName("toDate")]
        public DateOnly ToDate { get; set; }

        [JsonPropertyName("businessUnit")]
        public int BusinessUnit { get; set; }

        [JsonPropertyName("branchPaymentTotal")]
        public decimal branchPaymentTotal { get; set; }

        [JsonPropertyName("BranchPaymentList")]
        public List<BranchPaymentsDetailDto> BranchPaymentList { get; set; } = new List<BranchPaymentsDetailDto>();

    }
    public class BranchPaymentsDetailDto
    {
        [JsonPropertyName("sequence")]
        public int Sequence { get; set; }

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("branchNewShareGL")]
        public string branchNewShareGL { get; set; }


        [JsonPropertyName("businessUnitName")]
        public string BusinessUnitName { get; set; }

        [JsonPropertyName("transactionReferenceNumber")]
        public string TransactionReferenceNumber { get; set; }


        [JsonPropertyName("transactionDate")]
        public string? TransactionDate { get; set; }

    }
}