using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports
{
    public class ShareholderAddressDto
    {
        [JsonPropertyName("country")]
        public string Country { get; set; }

        [JsonPropertyName("city")]
        public string City { get; set; }

        [JsonPropertyName("subCity")]
        public string SubCity { get; set; }

        [JsonPropertyName("woreda")]
        public string Woreda { get; set; }

        [JsonPropertyName("kebele")]
        public string Kebele { get; set; }

        [JsonPropertyName("houseNumber")]
        public string HouseNumber { get; set; }
    }
}
