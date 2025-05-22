using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public record ShareholderRecordVersions(string Current, string? Approved, string? Submitted, string? Draft, string? Rejected);
    public record GetShareholderRecordVersionsQuery(int Id) : IRequest<ShareholderRecordVersions>;
    internal class GetShareholderRecordVersionsQueryHandler : IRequestHandler<GetShareholderRecordVersionsQuery, ShareholderRecordVersions>
    {
        private readonly IDataService dataService;

        public GetShareholderRecordVersionsQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<ShareholderRecordVersions> Handle(GetShareholderRecordVersionsQuery request, CancellationToken cancellationToken)
        {
            var current = await dataService.Shareholders.FirstOrDefaultAsync(s => s.Id == request.Id);
            if (current == null) { return null; }
            Guid currentVersion = current.VersionNumber;
            Guid? approvedVersion = null;
            Guid? rejectedVersion = null;

            if (current.ApprovalStatus != ApprovalStatus.Approved)
            {
                var approved = await dataService.Shareholders
                    .TemporalAll()
                    .Where(s => s.Id == request.Id && s.ApprovalStatus == ApprovalStatus.Approved)
                    .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                    .Select(s =>
                    new
                    {
                        PeriodEnd = EF.Property<DateTime>(s, "PeriodEnd"),
                        PeriodStart = EF.Property<DateTime>(s, "PeriodEnd"),
                        Version = s.VersionNumber
                    }).FirstOrDefaultAsync();

                approvedVersion = approved?.Version;

                if (approved != null)
                {
                    rejectedVersion = await dataService.Shareholders
                        .TemporalFromTo(approved.PeriodEnd.AddMicroseconds(100), DateTime.UtcNow.AddMicroseconds(100))
                        .Where(s => s.Id == request.Id && s.ApprovalStatus == ApprovalStatus.Rejected)
                        .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                        .Select(s => s.VersionNumber)
                        .FirstOrDefaultAsync();
                }
                else
                {
                    rejectedVersion = await dataService.Shareholders
                        .TemporalAll()
                        .Where(s => s.Id == request.Id && s.ApprovalStatus == ApprovalStatus.Rejected)
                        .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                        .Select(s => s.VersionNumber)
                        .FirstOrDefaultAsync();
                }
            }

            return new ShareholderRecordVersions(
                Current: convertToStr(currentVersion),
                Approved: convertToStr(current.ApprovalStatus == ApprovalStatus.Approved ? currentVersion : approvedVersion),
                Submitted: convertToStr(current.ApprovalStatus == ApprovalStatus.Submitted ? currentVersion : null),
                Draft: convertToStr(current.ApprovalStatus == ApprovalStatus.Draft ? currentVersion : null),
                Rejected: convertToStr(current.ApprovalStatus == ApprovalStatus.Rejected ? currentVersion : rejectedVersion));
        }

        private string? convertToStr(Guid? guid)
        {
            return guid == null || guid == Guid.Empty ? null : guid.ToString();
        }
    }
}
