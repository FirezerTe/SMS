using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain.Bank;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateBankAllocation)]
public record SetBankAllocationCommand(decimal Amount, string Name, decimal? MaxPercentagePurchaseLimit, string Description) : IRequest;

public class SetBankAllocationCommandHandler : IRequestHandler<SetBankAllocationCommand>
{
    private readonly IDataService dataService;

    public SetBankAllocationCommandHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task Handle(SetBankAllocationCommand request, CancellationToken cancellationToken)
    {
        var bankAllocation = await dataService.Banks.FirstOrDefaultAsync();
        if (bankAllocation == null)
        {
            bankAllocation = new Bank();
            dataService.Banks.Add(bankAllocation);
        }
        var maxPercentagePurchaseLimit = (request.MaxPercentagePurchaseLimit ?? 0) > 0 ? request.MaxPercentagePurchaseLimit : null;

        bankAllocation.Amount = request.Amount;
        bankAllocation.Name = request.Name;
        bankAllocation.MaxPercentagePurchaseLimit = maxPercentagePurchaseLimit;
        bankAllocation.Description = request.Description;

        await dataService.SaveAsync(cancellationToken);
    }
}
