using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class ShareholderDividendDecisionReportDto
    {
        [JsonPropertyName("Shareholderid")]
        public int Shareholderid { get; set; }

        [JsonPropertyName("totalCapitalizedAmount")]
        public decimal totalCapitalizedAmount { get; set; }

        [JsonPropertyName("totalWithdrawAmount")]
        public decimal totalWithdrawAmount { get; set; }

        [JsonPropertyName("totalTax")]
        public decimal totalTax { get; set; }

        [JsonPropertyName("ShareholderDividendDecision")]
        public List<ShareholderDividendDecisionDTO> DividendDecisions { get; set; } = new List<ShareholderDividendDecisionDTO>();

    }
    public class ShareholderDividendDecisionDTO
    {
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("amount")]
        public decimal dividendAmount { get; set; }

        [JsonPropertyName("DecisionDate")]
        public DateOnly DecisionDate { get; set; }

        [JsonPropertyName("DecisionType")]
        public string DecisionType { get; set; }

        [JsonPropertyName("capitalisedAmount")]
        public decimal capitalisedAmount { get; set; }

        [JsonPropertyName("withdrawnAmount")]
        public decimal withdrawnAmount { get; set; }

        [JsonPropertyName("fulfillmentAmount")]
        public decimal fulfillmentAmount { get; set; }

        [JsonPropertyName("netPay")]
        public decimal netPay { get; set; }

        [JsonPropertyName("desiredAmount")]
        public decimal desiredAmount { get; set; }

        [JsonPropertyName("Tax")]
        public decimal Tax { get; set; }


    }
}
