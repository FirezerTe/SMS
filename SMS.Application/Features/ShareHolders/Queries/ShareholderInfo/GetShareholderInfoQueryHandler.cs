using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public record GetShareholderInfoQuery(int Id, Guid? Version) : IRequest<ShareholderInfo?>;
    internal class GetShareholderInfoQueryHandler : IRequestHandler<GetShareholderInfoQuery, ShareholderInfo?>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetShareholderInfoQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<ShareholderInfo?> Handle(GetShareholderInfoQuery request, CancellationToken cancellationToken)
        {
            var shareholder = await dataService.Shareholders.TemporalAll()
               .Where(s => s.Id == request.Id &&
                       (request.Version != null && request.Version != Guid.Empty ? s.VersionNumber == request.Version : true))
               .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
               .ProjectTo<ShareholderInfo>(mapper.ConfigurationProvider)
               .AsNoTracking()
               .FirstOrDefaultAsync();

            if (shareholder != null)
            {
                var current = await dataService
                .Shareholders
                .Include(s => s.ShareholderDocuments)
                .Include(x=>x.ShareholderComments)
                .AsNoTracking()
                .FirstOrDefaultAsync(sh => sh.Id == request.Id);


                var shareholderDocuments = await dataService.ShareholderDocuments
                    .Where(s => s.ShareholderId == request.Id &&
                        (s.DocumentType == DocumentType.ShareholderPicture || s.DocumentType == DocumentType.ShareholderSignature) &&
                        s.IsDeleted != true)
                    .Select(d => new { d.DocumentType, d.DocumentId }).ToListAsync();

                shareholder.PhotoId = current?.ShareholderDocuments
                    .Where(d => d.DocumentType == DocumentType.ShareholderPicture)
                    .Select(d => d.DocumentId).FirstOrDefault();

                shareholder.SignatureId = current?.ShareholderDocuments
                    .Where(d => d.DocumentType == DocumentType.ShareholderSignature)

                    .Select(d => d.DocumentId).FirstOrDefault();

                shareholder.Comments = current?.ShareholderComments.OrderByDescending(c=>c.Date).ToList();
            }


            return shareholder;

        }
    }
}
