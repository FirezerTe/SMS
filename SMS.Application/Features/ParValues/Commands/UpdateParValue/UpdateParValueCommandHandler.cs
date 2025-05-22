using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateParValue)]
public record UpdateParValueCommand(int Id, decimal Amount, string Name, string Description) : IRequest;

public class UpdateParValueCommandHandler : IRequestHandler<UpdateParValueCommand>
{
    private readonly IDataService dataService;

    public UpdateParValueCommandHandler(IDataService dataService) => this.dataService = dataService;

    public async Task Handle(UpdateParValueCommand request, CancellationToken cancellationToken)
    {
        var parValue = await dataService.ParValues.FirstOrDefaultAsync(p => p.Id == request.Id);
        if (parValue != null)
        {
            parValue.Amount = request.Amount;
            parValue.Name = request.Name;
            parValue.Description = request.Description;

            await dataService.SaveAsync(cancellationToken);
        }
    }

}
