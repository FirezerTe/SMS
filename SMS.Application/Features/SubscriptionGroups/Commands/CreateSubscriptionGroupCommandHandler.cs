using MediatR;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateSubscriptionGroup)]

public record CreateSubscriptionGroupCommand(SubscriptionGroupInfo subscriptionGroup) : IRequest;

internal class CreateSubscriptionGroupCommandHandler : IRequestHandler<CreateSubscriptionGroupCommand>
{
    private readonly IDataService dataService;

    public CreateSubscriptionGroupCommandHandler(IDataService dataService) => this.dataService = dataService;

    public async Task Handle(CreateSubscriptionGroupCommand request, CancellationToken cancellationToken)
    {
        var premiumRanges = request.subscriptionGroup.SubscriptionPremium?.Ranges?.Select(range => new PremiumRange
        {
            UpperBound = range.UpperBound,
            Percentage = range.Percentage
        }).ToList() ?? new List<PremiumRange>();

        var subscriptionsGroup = new SubscriptionGroup()
        {
            Name = request.subscriptionGroup.Name,
            AllocationID = request.subscriptionGroup.AllocationID,
            MinFirstPaymentAmount = request.subscriptionGroup.MinFirstPaymentAmount,
            MinFirstPaymentAmountUnit = request.subscriptionGroup.MinFirstPaymentAmountUnit,
            ExpireDate = request.subscriptionGroup.ExpireDate,
            MinimumSubscriptionAmount = request.subscriptionGroup.MinimumSubscriptionAmount ?? 0,
            Description = request.subscriptionGroup.Description,
            SubscriptionPremium = new SubscriptionPremium { Ranges = premiumRanges }
        };

        dataService.SubscriptionGroups.Add(subscriptionsGroup);
        await dataService.SaveAsync(cancellationToken);
    }
}
