using MediatR;
using Microsoft.EntityFrameworkCore;

using SMS.Domain;

namespace SMS.Application.Lookups;

public record GetShareholderStatusQuery : IRequest<List<ShareholderStatus>>;

internal class GetShareholderStatusQueryHandler : IRequestHandler<GetShareholderStatusQuery, List<ShareholderStatus>>
{
    private readonly IDataService dataService;

    public GetShareholderStatusQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }


    public async Task<List<ShareholderStatus>> Handle(GetShareholderStatusQuery request, CancellationToken cancellationToken)
    {
        return await dataService.ShareholderStatuses.ToListAsync();
    }
}
