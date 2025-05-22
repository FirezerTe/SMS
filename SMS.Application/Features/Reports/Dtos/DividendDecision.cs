using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class DividendDecisionReportDto
    {
        [JsonPropertyName("fromDate")]
        public DateOnly fromDate { get; set; }

        [JsonPropertyName("toDate")]
        public DateOnly toDate { get; set; }

        [JsonPropertyName("totalCapitalizedAmount")]
        public decimal totalCapitalizedAmount { get; set; }

        [JsonPropertyName("totalDividendAmount")]
        public decimal totalDividendAmount { get; set; }

        [JsonPropertyName("totalWithdrawAmount")]
        public decimal totalWithdrawAmount { get; set; }

        [JsonPropertyName("totalTax")]
        public decimal totalTax { get; set; }

        [JsonPropertyName("dividendDecision")]
        public List<DividendDecisionDTO> dividendDecisions { get; set; } = new List<DividendDecisionDTO>();

    }
    public class DividendDecisionDTO
    {
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }


        [JsonPropertyName("capitalizedAmount")]
        public decimal CapitalisedAmount { get; set; }


        [JsonPropertyName("withdrawalAmount")]
        public decimal WithdrawnAmount { get; set; }

        [JsonPropertyName("DecisionDate")]
        public DateOnly DecisionDate { get; set; }
        [JsonPropertyName("decisionType")]
        public string DecisionType { get; set; }

        [JsonPropertyName("dividendAmount")]
        public decimal DividendAmount { get; set; }

        [JsonPropertyName("FulfillmentAmount")]
        public decimal FulfillmentAmount { get; set; }

        [JsonPropertyName("Tax")]
        public decimal Tax { get; set; }

        [JsonPropertyName("netPay")]
        public decimal netPay { get; set; }

        [JsonPropertyName("desiredAmount")]
        public decimal DesiredAmount { get; set; }




    }
}
