using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateDividendSetup)]
public record ComputeDividendRateCommand(int SetupID) : IRequest;

public class ComputeDividendRateCommandHandler : IRequestHandler<ComputeDividendRateCommand>
{
    private readonly IDataService dataService;
    private readonly IBackgroundJobScheduler backgroundJobScheduler;

    public ComputeDividendRateCommandHandler(IDataService dataService, IBackgroundJobScheduler backgroundJobScheduler)
    {
        this.dataService = dataService;
        this.backgroundJobScheduler = backgroundJobScheduler;
    }
    public async Task Handle(ComputeDividendRateCommand request, CancellationToken cancellationToken)
    {
        var setup = await dataService.DividendSetups.FirstOrDefaultAsync(s => s.Id == request.SetupID);

        if (setup == null)
        {
            throw new Exception("Unable to find dividend setup");
        }

        if (setup.DividendRateComputationStatus != DividendRateComputationStatus.Computing || setup.DistributionStatus != DividendDistributionStatus.NotStarted)
        {
            setup.DividendRateComputationStatus = DividendRateComputationStatus.Computing;
            setup.DistributionStatus = DividendDistributionStatus.NotStarted;
            await dataService.SaveAsync(cancellationToken);
        }

        backgroundJobScheduler.EnqueueDistributeDividendToShareholders(request.SetupID);
    }
}
