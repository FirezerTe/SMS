using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Application;

public record ShareholderChangeLogDto(int Id, int ShareholderId, ShareholderChangeLogEntityType EntityType, int EntityId, ChangeType ChangeType);

public record GetShareholderChangeLogCommand(int ShareholderId) : IRequest<List<ShareholderChangeLogDto>>;

public class GetShareholderChangeLogCommandHandler : IRequestHandler<GetShareholderChangeLogCommand, List<ShareholderChangeLogDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetShareholderChangeLogCommandHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<List<ShareholderChangeLogDto>> Handle(GetShareholderChangeLogCommand request, CancellationToken cancellationToken)
    {
        var result = await dataService.ShareholderChangeLogs.Where(l => l.ShareholderId == request.ShareholderId).ProjectTo<ShareholderChangeLogDto>(mapper.ConfigurationProvider).ToListAsync();
        return result;
    }
}
