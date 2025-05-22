using MediatR;

namespace SMS.Application;

public class ShareholderTypeaheadSearchQuery : IRequest<List<ShareholderBasicInfo>>
{
    public string Name { get; set; }
}
