using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace SMS.Application;

public class SearchShareholderByNameQueryHandler : IRequestHandler<ShareholderTypeaheadSearchQuery, List<ShareholderBasicInfo>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public SearchShareholderByNameQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }


    public async Task<List<ShareholderBasicInfo>> Handle(ShareholderTypeaheadSearchQuery request, CancellationToken cancellationToken)
    {

        var term = (request.Name ?? "").Trim().ToLower();
        if (string.IsNullOrWhiteSpace(term)) return new List<ShareholderBasicInfo>();

        int shareholderNumber = 0;
        if (int.TryParse(term, out shareholderNumber))
        {
            return await dataService.Shareholders.ProjectTo<ShareholderBasicInfo>(mapper.ConfigurationProvider)
                                                 .Where(s => s.ShareholderNumber == shareholderNumber)
                                                 .ToListAsync();
        }
        //var termLowers = term.ToLower();
        //var results = await dataService.Shareholders
        //                 .Include(x => x.ShareholderDocuments)
        //                 .Where(sh => !string.IsNullOrEmpty(term) &&
        //                              sh.DisplayName.ToLower().Contains(termLowers))
        //                 .Select(sh => new
        //                 {
        //                     Shareholder = sh,
        //                     RelevanceScore =
        //                         (sh.DisplayName.ToLower().IndexOf(termLowers) + 1) +
        //                         (sh.DisplayName.ToLower().Split()
        //                             .Select((part, index) => part.IndexOf(termLowers))
        //                             .Sum(index => index >= 0 ? (1 / (index + 1)) * 1000 : 0))
        //                 })
        //                 .OrderByDescending(x => x.Shareholder) // Order by the relevance score
        //                 .Select(x => x.Shareholder) // Select the original Shareholder object
        //                 .ToListAsync();
        //var result = await dataService.Shareholders
        //    .Include(x => x.ShareholderDocuments)
        //    .Where(sh => !string.IsNullOrEmpty(term) &&
        //    (
        //        sh.DisplayName.ToLower().Contains(term) ||
        //        IDataService.SoundsLike(sh.DisplayName.ToLower()) == IDataService.SoundsLike(term)
        //    )).ToListAsync();
        var termLower = term?.ToLower();

        var results = await dataService.Shareholders
            .Include(x => x.ShareholderDocuments)
            .Where(sh => !string.IsNullOrEmpty(term) &&
                         sh.DisplayName.ToLower().Contains(termLower))
            .OrderBy(sh => sh.DisplayName.ToLower().StartsWith(termLower) ? 0 : 1) // Exact match first
            .ThenBy(sh => sh.DisplayName) // Secondary sort by name
            .ToListAsync();

        return mapper.Map<List<ShareholderBasicInfo>>(results);
    }


}
