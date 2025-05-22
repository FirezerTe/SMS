using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application;


public record BlockedShareholderAttachmentDto(
    string DocumentId,
    bool IsImage,
    string FileName
);

public class ShareholderBlockDetail
{
    public int? Id { get; set; }
    public double? Amount { get; set; }
    public ShareUnit? Unit { get; set; }
    public string Description { get; set; }
    public DateTime? BlockedTill { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public bool? IsActive { get; set; }
    public int ShareholderId { get; set; }
    public int BlockTypeId { get; set; }
    public int BlockReasonId { get; set; }
    public List<BlockedShareholderAttachmentDto>? Attachments { get; set; }

}

public record GetShareholderBlockDetailCommand(int ShareholderId, Guid? VersionNumber) : IRequest<ShareholderBlockDetail?>;

public class GetShareholderBlockDetailCommandHandler : IRequestHandler<GetShareholderBlockDetailCommand, ShareholderBlockDetail?>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetShareholderBlockDetailCommandHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<ShareholderBlockDetail?> Handle(GetShareholderBlockDetailCommand request, CancellationToken cancellationToken)
    {
        DateTime? shareholderRecordPeriodEnd = request.VersionNumber == null
                ? DateTime.UtcNow.AddDays(1)
                : await dataService.Shareholders.TemporalAll()
                                                .Where(s => s.Id == request.ShareholderId && s.VersionNumber == request.VersionNumber)
                                                .Select(s => EF.Property<DateTime?>(s, "PeriodEnd"))
                                                                            .FirstOrDefaultAsync();

        if (shareholderRecordPeriodEnd == null) return null;

        var blockedDetail = await dataService.BlockedShareholders.TemporalAsOf(shareholderRecordPeriodEnd.Value.AddMicroseconds(-100))
                                                                 .Where(b => b.ShareholderId == request.ShareholderId)
                                                                 .OrderByDescending(b => b.CreatedAt)
                                                                 .ProjectTo<ShareholderBlockDetail>(mapper.ConfigurationProvider)
                                                                 .FirstOrDefaultAsync();

        return blockedDetail;
    }
}
