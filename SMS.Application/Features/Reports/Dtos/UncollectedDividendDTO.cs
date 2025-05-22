using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class UncollectedDividendReportDto
    {
        [JsonPropertyName("totalUncollected")]
        public decimal TotalUncollected { get; set; }

        [JsonPropertyName("TotalDividend")]
        public decimal TotalDividend { get; set; }

        [JsonPropertyName("TotalTax")]
        public decimal TotalTax { get; set; }


        [JsonPropertyName("uncollectedDividend")]
        public List<UncollectedDividendDTO> UncollectedDividend { get; set; } = new List<UncollectedDividendDTO>();

    }
    public class UncollectedDividendDTO
    {
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }


        [JsonPropertyName("amount")]
        public decimal amount { get; set; }

        [JsonPropertyName("Tax")]
        public decimal Tax { get; set; }

        [JsonPropertyName("fiscalYear")]
        public string fiscalYear { get; set; }

    }
}
