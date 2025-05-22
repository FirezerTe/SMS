using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateDividendSetup)]
public record UpdateDividendSetupCommand(int Id, decimal DeclaredAmount, decimal TaxRate, DateOnly DividendTaxDueDate, string? Description, decimal AdditionalAllocationAmount) : IRequest;

public class UpdateDividendSetupCommandHandler : IRequestHandler<UpdateDividendSetupCommand>
{
    private readonly IDataService dataService;
    private readonly IAllocationService allocationService;

    public UpdateDividendSetupCommandHandler(IDataService dataService, IAllocationService allocationService)
    {
        this.dataService = dataService;
        this.allocationService = allocationService;
    }
    public async Task Handle(UpdateDividendSetupCommand request, CancellationToken cancellationToken)
    {
        var setup = await dataService.DividendSetups.FirstOrDefaultAsync(d => d.Id == request.Id);
        if (setup != null)
        {
            setup.DeclaredAmount = request.DeclaredAmount;
            setup.TaxRate = request.TaxRate;
            setup.DividendTaxDueDate = request.DividendTaxDueDate;
            setup.Description = request.Description;
            setup.DividendRateComputationStatus = DividendRateComputationStatus.NotStarted;
            setup.DistributionStatus = DividendDistributionStatus.NotStarted;
            setup.ApprovalStatus = Domain.Enums.ApprovalStatus.Draft;
            setup.AdditionalAllocationAmount = request.AdditionalAllocationAmount;

            await allocationService.IncrementDividendAllocationAmount(request.AdditionalAllocationAmount);

            await dataService.SaveAsync(cancellationToken);
        }
    }
}
