using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;


public class GetFamiliesQuery : IRequest<List<FamilyDto>>
{
    public List<int> ShareholderIds { get; set; }
}

internal class GetFamiliesQueryHanlder : IRequestHandler<GetFamiliesQuery, List<FamilyDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetFamiliesQueryHanlder(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }


    public async Task<List<FamilyDto>> Handle(GetFamiliesQuery request, CancellationToken cancellationToken)
    {
        var families = dataService.Families
            .Include(f => f.Members)
            .ThenInclude(m => m.ShareholderDocuments)
            .Where(f => f.ShareholderFamilies.Any(sf => request.ShareholderIds.Contains(sf.ShareholderId)))
            .GroupBy(x => x.Id)
            .AsSplitQuery()
            .Select(x => x.FirstOrDefault());


        return mapper.Map<List<FamilyDto>>(families);

    }
}
