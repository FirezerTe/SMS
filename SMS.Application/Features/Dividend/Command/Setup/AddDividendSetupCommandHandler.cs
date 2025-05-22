using MediatR;
using SMS.Application.Security;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateDividendSetup)]
public record AddDividendSetupCommand(int DividendPeriodId, decimal DeclaredAmount, decimal AdditionalAllocationAmount, decimal TaxRate, DateOnly DividendTaxDueDate, string? Description) : IRequest;

public class AddDividendSetupCommandHandler : IRequestHandler<AddDividendSetupCommand>
{
    private readonly IDataService dataService;
    private readonly IAllocationService allocationService;

    public AddDividendSetupCommandHandler(IDataService dataService, IAllocationService allocationService)
    {
        this.dataService = dataService;
        this.allocationService = allocationService;
    }
    public async Task Handle(AddDividendSetupCommand request, CancellationToken cancellationToken)
    {
        var setup = new DividendSetup
        {
            DividendPeriodId = request.DividendPeriodId,
            DeclaredAmount = request.DeclaredAmount,
            Description = request.Description,
            TaxRate = request.TaxRate,
            DividendTaxDueDate = request.DividendTaxDueDate,
            DividendRateComputationStatus = DividendRateComputationStatus.NotStarted,
            DistributionStatus = DividendDistributionStatus.NotStarted,
            ApprovalStatus = ApprovalStatus.Draft,
            AdditionalAllocationAmount = request.AdditionalAllocationAmount,
        };

        dataService.DividendSetups.Add(setup);
        await allocationService.IncrementDividendAllocationAmount(request.AdditionalAllocationAmount);

        await dataService.SaveAsync(cancellationToken);
    }
}
