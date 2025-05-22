using MediatR;

namespace SMS.Application;

public class GetShareholderDetailQuery : IRequest<ShareholderDetailsDto>
{
    public int Id { get; set; }
}
