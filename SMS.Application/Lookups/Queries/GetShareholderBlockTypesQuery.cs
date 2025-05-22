using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Application;

public record GetShareholderBlockTypesQuery() : IRequest<List<ShareholderBlockType>>;
internal class GetShareholderBlockTypesQueryHandler : IRequestHandler<GetShareholderBlockTypesQuery, List<ShareholderBlockType>>
{
    private readonly IDataService dataService;

    public GetShareholderBlockTypesQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task<List<ShareholderBlockType>> Handle(GetShareholderBlockTypesQuery request, CancellationToken cancellationToken)
    {
        return await dataService.ShareholderBlockTypes.ToListAsync();
    }
}
