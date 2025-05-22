using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports
{
    public class ShareCertificateReportDto
    {
        [JsonPropertyName("displayNameAmharic")]
        public string DisplayNameAmharic { get; set; }

        [JsonPropertyName("displayNameEnglish")]
        public string DisplayNameEnglish { get; set; }

        [JsonPropertyName("totalShareCount")]
        public int TotalShareCount { get; set; }

        [JsonPropertyName("totalShareInBirr")]
        public double TotalShareInBirr { get; set; }

        [JsonPropertyName("shareholderPhoneNumber")]
        public string ShareholderPhoneNumber { get; set; }

        [JsonPropertyName("shareholderId")]
        public int ShareholderId { get; set; }

        [JsonPropertyName("shareParValue")]
        public int ShareParValue { get; set; }

        [JsonPropertyName("paidUpShareInBirr")]
        public int PaidUpShareInBirr { get; set; }

        [JsonPropertyName("registrationNumber")]
        public string RegistrationNumber { get; set; }

        [JsonPropertyName("registrationDate")]
        public DateOnly RegistrationDate { get; set; }

        [JsonPropertyName("placeOfRegistration")]
        public string PlaceOfRegistration { get; set; }

        [JsonPropertyName("totalSubscriptionInBirr")]
        public double TotalSubscriptionInBirr { get; set; }

        [JsonPropertyName("paidUpSubscriptionInBirr")]
        public int PaidUpSubscriptionInBirr { get; set; }

        [JsonPropertyName("certificateNumber")]
        public string CertificateNumber { get; set; }

        [JsonPropertyName("address")]
        public ShareholderAddressDto? Address { get; set; }
    }
}