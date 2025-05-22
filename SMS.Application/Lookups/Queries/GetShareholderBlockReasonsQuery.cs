using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Application;

public record GetShareholderBlockReasonsQuery() : IRequest<List<ShareholderBlockReason>>;
internal class GetShareholderBlockReasonsQueryHandler : IRequestHandler<GetShareholderBlockReasonsQuery, List<ShareholderBlockReason>>
{
    private readonly IDataService dataService;

    public GetShareholderBlockReasonsQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task<List<ShareholderBlockReason>> Handle(GetShareholderBlockReasonsQuery request, CancellationToken cancellationToken)
    {
        return await dataService.ShareholderBlockReasons.ToListAsync();
    }
}
