using MediatR;
using SMS.Application.Security;

namespace SMS.Application;



[Authorize(Policy = AuthPolicy.CanCreateOrUpdateAllocation)]
public record CreateAllocationCommand(CreateAllocationPayload payload) : IRequest<int>;

internal class CreateAllocationCommandHandler : IRequestHandler<CreateAllocationCommand, int>
{
    private readonly IAllocationService allocationService;

    public CreateAllocationCommandHandler(IAllocationService allocationService)
    {
        this.allocationService = allocationService;
    }
    public async Task<int> Handle(CreateAllocationCommand request, CancellationToken cancellationToken)
    {
        var allocation = await allocationService.AddNewAllocationAndSaveAsync(request.payload, cancellationToken);
        return allocation.Id;
    }
}
