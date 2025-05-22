using MediatR;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateParValue)]
public record CreateParValueCommand(decimal Amount, string Name, string Description) : IRequest<int>;

public class CreateValueCommandHandler : IRequestHandler<CreateParValueCommand, int>
{
    private readonly IDataService dataService;

    public CreateValueCommandHandler(IDataService dataService) => this.dataService = dataService;

    public async Task<int> Handle(CreateParValueCommand request, CancellationToken cancellationToken)
    {
        var parValue = new ParValue()
        {
            Amount = request.Amount,
            Name = request.Name,
            Description = request.Description,
        };

        dataService.ParValues.Add(parValue);
        await dataService.SaveAsync(cancellationToken);
        return parValue.Id;
    }

}
