using MediatR;
using Microsoft.EntityFrameworkCore;

using SMS.Domain;

namespace SMS.Application.Lookups;

public record GetShareholderTypesQuery : IRequest<List<ShareholderType>>;

internal class GetShareholderTypesQueryHandler : IRequestHandler<GetShareholderTypesQuery, List<ShareholderType>>
{
    private readonly IDataService dataService;

    public GetShareholderTypesQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }


    public async Task<List<ShareholderType>> Handle(GetShareholderTypesQuery request, CancellationToken cancellationToken)
    {
        return await dataService.ShareholderTypes.ToListAsync();
    }
}
