
using System.Text.Json.Serialization;

namespace SMS.Application.Features.Reports;

public class ShareholderListDto
{
    [JsonPropertyName("shareholderName")]
    public string ShareholderName { get; set; }

    [JsonPropertyName("shareholderId")]
    public int ShareholderId { get; set; }
    [JsonPropertyName("totalSubscription")]
    public double TotalSubscription { get; set; }
    [JsonPropertyName("totalPaidUpInBirr")]
    public double TotalPaidUpInBirr { get; set; }

    [JsonPropertyName("totalPaidUpShares")]
    public int TotalPaidUpShares { get; set; }

    [JsonPropertyName("countryOfCitizenship")]
    public string CountryOfCitizenship { get; set; }

    [JsonPropertyName("ethiopianOrgin")]
    public string? EthiopianOrgin { get; set; }
    [JsonPropertyName("emailAddress")]
    public string? EmailAddress { get; set; }
    [JsonPropertyName("phoneNumber")]
    public string? PhoneNumber { get; set; }
    [JsonPropertyName("registrationDate")]
    public string? RegistrationDate { get; set; }
    [JsonPropertyName("Status")]
    public bool? Status { get; set; }
    [JsonPropertyName("shareholderStatus")]
    public string? ShareholderStatus { get; set; }
}
public class ShareholderListReportDto
{
    [JsonPropertyName("totalPaymentAmount")]
    public double? TotalPaymentAmount { get; set; }
    [JsonPropertyName("totalSubscription")]
    public double? TotalSubscription { get; set; }
    [JsonPropertyName("shareholders")]
    public List<ShareholderListDto> Shareholders { get; set; } = new List<ShareholderListDto>();
}