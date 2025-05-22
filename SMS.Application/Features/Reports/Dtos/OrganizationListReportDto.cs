using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports.Dtos
{
    public class OrganizationListReportDto
    {
        [JsonPropertyName("organizations")]
        public string Organizations { get; set; }

        [JsonPropertyName("organizationList")]
        public List<OrganizationListDto> OrganizationList { get; set; } = new List<OrganizationListDto>();

    }
    public class OrganizationListDto
    {
        [JsonPropertyName("sequence")]
        public int Sequence { get; set; }
        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("shareholderName")]
        public string ShareholderName { get; set; }


        [JsonPropertyName("shareholderStatus")]
        public string ShareholderStatus { get; set; }

        [JsonPropertyName("representativeName")]
        public string RepresentativeName { get; set; }

        [JsonPropertyName("representativeEmail")]
        public string RepresentativeEmail { get; set; }
        [JsonPropertyName("city")]
        public string City { get; set; }
        [JsonPropertyName("kebele")]
        public string Kebele { get; set; }
        [JsonPropertyName("woreda")]
        public string Woreda { get; set; }
        [JsonPropertyName("contact")]
        public string contact { get; set; }

    }

}