using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Application.Security;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateAllocation)]
public record UpdateAllocationCommand(
    int Id,
    string Name,
    decimal Amount,
    DateOnly? FromDate,
    DateOnly? ToDate,
    string Description,
    bool? IsOnlyForExistingShareholders) : IRequest<int>;

public class UpdateAllocationHandler : IRequestHandler<UpdateAllocationCommand, int>
{
    private readonly IDataService dataService;

    public UpdateAllocationHandler(IDataService dataService, IEmailSenderService emailService)
    {
        this.dataService = dataService;
    }
    public async Task<int> Handle(UpdateAllocationCommand request, CancellationToken cancellationToken)
    {
        var allocation = await dataService.Allocations.FirstOrDefaultAsync(a => a.Id == request.Id);
        if (allocation == null)
            throw new NotFoundException($"Unable to find allocation", request);

        allocation.Name = request.Name;
        allocation.Amount = request.Amount;
        allocation.Description = request.Description;
        allocation.FromDate = request.FromDate ?? DateOnly.FromDateTime(DateTime.Today);

        allocation.ToDate = request.ToDate;
        allocation.AllocationRemaining = request.Amount;
        allocation.IsOnlyForExistingShareholders = request.IsOnlyForExistingShareholders;

        await dataService.SaveAsync(cancellationToken);

        return allocation.Id;
    }
}
