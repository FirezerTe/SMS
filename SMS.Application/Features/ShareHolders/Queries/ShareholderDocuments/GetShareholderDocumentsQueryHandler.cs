using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;

public record ShareholderDocumentDto(int Id, int ShareholderId, DocumentType DocumentType, string DocumentId, string FileName, DateTime? CreatedAt);

public record GetShareholderDocumentsQuery(int ShareholderId) : IRequest<List<ShareholderDocumentDto>>;

public class GetShareholderDocumentsQueryHandler : IRequestHandler<GetShareholderDocumentsQuery, List<ShareholderDocumentDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetShareholderDocumentsQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }

    public async Task<List<ShareholderDocumentDto>> Handle(GetShareholderDocumentsQuery request, CancellationToken cancellationToken)
    {
        var result = await dataService.ShareholderDocuments.Where(d => d.ShareholderId == request.ShareholderId).OrderByDescending(d => d.CreatedAt).ProjectTo<ShareholderDocumentDto>(mapper.ConfigurationProvider).ToListAsync();

        return result;
    }
}
