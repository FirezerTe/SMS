using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class ActiveShareholderListForGAReportDto
    {
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }
        [JsonPropertyName("ActiveShareholderListForGA")]
        public List<ActiveShareholderListForGADto> ActiveShareholderListForGA { get; set; } = new List<ActiveShareholderListForGADto>();

    }
    public class ActiveShareholderListForGADto
    {
        [JsonPropertyName("shareholderID")]
        public int ShareholderID { get; set; }
        [JsonPropertyName("sequence")]
        public int Sequence { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }

        [JsonPropertyName("city")]
        public string City { get; set; }
        [JsonPropertyName("subcity")]
        public string Subcity { get; set; }
        [JsonPropertyName("woreda")]
        public string Woreda { get; set; }
        [JsonPropertyName("kebele")]
        public string Kebele { get; set; }
        [JsonPropertyName("houseNo")]
        public string HouseNo { get; set; }
        [JsonPropertyName("shareAmount")]
        public decimal ShareAmount { get; set; }
        [JsonPropertyName("votingAmount")]
        public decimal VotingAmount { get; set; }
        [JsonPropertyName("representative")]
        public string Representative { get; set; }

    }
}