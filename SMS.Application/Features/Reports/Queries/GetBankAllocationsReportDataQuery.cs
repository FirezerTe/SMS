using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetBankAllocationsReportDataQuery : IRequest<BankAllocationReportDtos>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

    public class GetBankAllocationsReportDataQueryHandler : IRequestHandler<GetBankAllocationsReportDataQuery, BankAllocationReportDtos>
    {
        private readonly IDataService dataService;

        public GetBankAllocationsReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<BankAllocationReportDtos> Handle(GetBankAllocationsReportDataQuery request, CancellationToken cancellationToken)
        {
            return new BankAllocationReportDtos
            {
                FromDate = request.FromDate,
                ToDate = request.ToDate,
                BankAllocations = await GetBankAllocationAsync(request)
            };
        }
        private async Task<List<BankAllocationsDto>> GetBankAllocationAsync(GetBankAllocationsReportDataQuery request)
        {
            var bankAllocate = new List<BankAllocationsDto>();
            var searchBankAllocations = await dataService.Banks
              .Where(a => DateOnly.FromDateTime(a.CreatedAt.Value.Date) >= request.FromDate && DateOnly.FromDateTime(a.CreatedAt.Value.Date) <= request.ToDate
               && a.ApprovalStatus == ApprovalStatus.Approved)
              .ToListAsync();
            for (int i = 0; i < searchBankAllocations.Count; i++)
            {
                var sequence = i + 1;
                var allocation = new BankAllocationsDto
                {
                    Sequence = sequence,
                    Amount = searchBankAllocations[i].Amount,
                    BankAllocationName = searchBankAllocations[i].Name,
                    MaxPercentagePurchaseLimit = searchBankAllocations[i].MaxPercentagePurchaseLimit,
                    Deacription = searchBankAllocations[i].Description,
                    CreatedAt = (searchBankAllocations[i].CreatedAt.Value.Date).ToString("dd MMMM yyyy"),
                };
                bankAllocate.Add(allocation);
            }
            return bankAllocate;
        }
    }
}