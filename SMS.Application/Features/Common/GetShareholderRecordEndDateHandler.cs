using MediatR;
using Microsoft.EntityFrameworkCore;


namespace SMS.Application.Features.Common
{
    public record GetShareholderRecordEndDateQuery(int ShareholderId, Guid? Version) : IRequest<DateTime>;
    internal class GetShareholderRecordEndDateHandler : IRequestHandler<GetShareholderRecordEndDateQuery, DateTime>
    {
        private readonly IDataService dataService;

        public GetShareholderRecordEndDateHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<DateTime> Handle(GetShareholderRecordEndDateQuery request, CancellationToken cancellationToken)
        {
            return await dataService.Shareholders.TemporalAll()
                .Where(s => s.Id == request.ShareholderId &&
                        (request.Version != null && request.Version != Guid.Empty ? s.VersionNumber == request.Version : true))
                .OrderByDescending(s => EF.Property<DateTime>(s, "PeriodEnd"))
                .Select(s => EF.Property<DateTime>(s, "PeriodEnd"))
                .FirstOrDefaultAsync();
        }
    }
}
