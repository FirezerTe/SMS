using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanApproveDividendSetup)]
public record ApproveDividendSetupCommand(int SetupID) : IRequest;

public class ApproveDividendSetupCommandHandler : IRequestHandler<ApproveDividendSetupCommand>
{
    private readonly IDataService dataService;
    private readonly IBackgroundJobScheduler backgroundJobScheduler;
    private readonly IUserService userService;
    private readonly IAllocationService allocationService;

    public ApproveDividendSetupCommandHandler(IDataService dataService, IBackgroundJobScheduler backgroundJobScheduler, IUserService userService, IAllocationService allocationService)
    {
        this.dataService = dataService;
        this.backgroundJobScheduler = backgroundJobScheduler;
        this.userService = userService;
        this.allocationService = allocationService;
    }
    public async Task Handle(ApproveDividendSetupCommand request, CancellationToken cancellationToken)
    {
        var setup = await dataService.DividendSetups.FirstOrDefaultAsync(s => s.Id == request.SetupID);

        if (setup == null)
        {
            throw new Exception("Unable to find dividend setup");
        }
        var dividendAllocation = await dataService.Allocations.FirstOrDefaultAsync(a => a.IsDividendAllocation);
        if (dividendAllocation == null) throw new Exception("Unable to find dividend allocation");


        if (setup.ApprovalStatus != ApprovalStatus.Approved)
        {
            await dataService.Dividends
                    .Where(d => d.DividendSetupId == setup.Id)
                    .ExecuteUpdateAsync(s => s.SetProperty(p => p.ApprovalStatus, ApprovalStatus.Approved));

            setup.ApprovalStatus = ApprovalStatus.Approved;
            setup.ApprovedBy = userService.GetCurrentUserId();
            setup.ApprovedAt = DateOnly.FromDateTime(DateTime.Now);
            dividendAllocation.ApprovalStatus = ApprovalStatus.Approved;
            dividendAllocation.ApprovedBy = userService.GetCurrentUserId();
            dividendAllocation.ApprovedAt = DateTime.Now;

            await dataService.SaveAsync(cancellationToken);

            await allocationService.ComputeAllocationSummaryAsync(dividendAllocation.Id, cancellationToken);
        }
    }
}
