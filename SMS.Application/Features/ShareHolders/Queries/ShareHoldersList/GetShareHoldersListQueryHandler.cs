using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;


public record ShareholderSearchResult(List<ShareholderSummary> Items, int TotalCount);
public record GetShareholdersListQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<ShareholderSearchResult>;


public class GetShareholdersListQueryHandler : IRequestHandler<GetShareholdersListQuery, ShareholderSearchResult>
{
    private readonly IMapper mapper;
    private readonly IDataService dataService;

    public GetShareholdersListQueryHandler(IMapper mapper, IDataService dataService)
    {
        this.mapper = mapper;
        this.dataService = dataService;
    }

    public async Task<ShareholderSearchResult> Handle(GetShareholdersListQuery request, CancellationToken cancellationToken)
    {
        if (request.Status == ApprovalStatus.Submitted)
        {
            var result = await dataService.ShareholderApprovalRequests
                .Include(s => s.Type)
                .OrderBy(s => s.Id)
                .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                .ProjectTo<ShareholderSummary>(mapper.ConfigurationProvider)
                .AsNoTracking().ToListAsync();

            var count = await dataService.ShareholderApprovalRequests.CountAsync();

            return new(result, count);
        }
        else if (request.Status == ApprovalStatus.Rejected)
        {
            var result = await dataService.RejectedShareholderApprovalRequests
                .Include(s => s.Type)
                .OrderBy(s => s.Id)
                .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                .ProjectTo<ShareholderSummary>(mapper.ConfigurationProvider)
                .AsNoTracking().ToListAsync();

            var count = await dataService.RejectedShareholderApprovalRequests.CountAsync();

            return new(result, count);
        }
        else if (request.Status == ApprovalStatus.Draft)
        {
            var result = await dataService.DraftShareholders
                .Include(s => s.Type)
                .OrderBy(s => s.Id)
                .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                .ProjectTo<ShareholderSummary>(mapper.ConfigurationProvider)
                .AsNoTracking().ToListAsync();

            var count = await dataService.DraftShareholders.CountAsync();

            return new(result, count);
        }
        else
        {
            var result = await dataService.ApprovedShareholders
                .Include(s => s.Type)
                .OrderBy(s => s.Id)
                .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                .ProjectTo<ShareholderSummary>(mapper.ConfigurationProvider)
                .AsNoTracking().ToListAsync();

            var count = await dataService.ApprovedShareholders.CountAsync();

            return new(result, count);
        }

        return null;
    }


}
