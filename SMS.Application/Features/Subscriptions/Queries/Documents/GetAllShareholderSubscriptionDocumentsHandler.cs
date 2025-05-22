using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record GetAllShareholderSubscriptionDocumentsQuery(int ShareholderId) : IRequest<List<SubscriptionDocumentDto>>;

public class GetAllShareholderSubscriptionDocumentsHandler : IRequestHandler<GetAllShareholderSubscriptionDocumentsQuery, List<SubscriptionDocumentDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetAllShareholderSubscriptionDocumentsHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<List<SubscriptionDocumentDto>> Handle(GetAllShareholderSubscriptionDocumentsQuery request, CancellationToken cancellationToken)
    {

        var subscriptionIds = await dataService.Subscriptions.Where(s => s.ShareholderId == request.ShareholderId)
                                                                .Select(s => s.Id).ToListAsync();

        return await dataService.SubscriptionDocuments.Where(d => subscriptionIds.Contains(d.SubscriptionId))
            .ProjectTo<SubscriptionDocumentDto>(mapper.ConfigurationProvider).ToListAsync();
    }
}
