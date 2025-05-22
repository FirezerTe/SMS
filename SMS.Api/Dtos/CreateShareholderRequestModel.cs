using SMS.Application;

namespace SMS.Api.Dtos;

public class CreateShareholderRequestModel
{
    public ShareholderDetailsDto ShareholderDetail { get; set; }
    public List<AddressDto> Addresses { get; set; }
}
