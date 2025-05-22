using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

using SMS.Application.Features.Common;

namespace SMS.Application;

public record GetShareholderContactsQuery(int ShareholderId, Guid? Version) : IRequest<List<ContactDto>>;

public class GetShareholderContactsQueryHandler :
    IRequestHandler<GetShareholderContactsQuery, List<ContactDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;
    private readonly IMediator mediator;

    public GetShareholderContactsQueryHandler(IDataService dataService, IMapper mapper, IMediator mediator)
    {
        this.dataService = dataService;
        this.mapper = mapper;
        this.mediator = mediator;
    }
    public async Task<List<ContactDto>> Handle(GetShareholderContactsQuery request, CancellationToken cancellationToken)
    {
        var shareholderRecordEndDate =
            await mediator.Send(new GetShareholderRecordEndDateQuery(ShareholderId: request.ShareholderId, Version: request.Version));

        var contacts = await dataService.Contacts
            .TemporalAsOf(shareholderRecordEndDate.AddMilliseconds(-100))
            .Where(c => c.ShareholderId == request.ShareholderId)
            .ProjectTo<ContactDto>(mapper.ConfigurationProvider)
            .ToListAsync();

        return contacts;
    }
}
