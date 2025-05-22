using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateSubscriptionGroup)]
public record UpdateSubscriptionGroupCommand(SubscriptionGroupInfo subscriptionGroup) : IRequest;

internal class UpdateSubscriptionGroupCommandHandler : IRequestHandler<UpdateSubscriptionGroupCommand>
{
    private readonly IDataService dataService;

    public UpdateSubscriptionGroupCommandHandler(IDataService dataService)
    {

        this.dataService = dataService;
    }
    public async Task Handle(UpdateSubscriptionGroupCommand request, CancellationToken cancellationToken)
    {
        var subscriptionsGroup = await dataService.SubscriptionGroups.FirstOrDefaultAsync(x => x.Id == request.subscriptionGroup.Id);
        if (subscriptionsGroup == null)
            throw new NotFoundException($"Unable to find allocation", request);

        subscriptionsGroup.AllocationID = request.subscriptionGroup.AllocationID;
        subscriptionsGroup.Name = request.subscriptionGroup.Name;
        subscriptionsGroup.ExpireDate = request.subscriptionGroup.ExpireDate;
        subscriptionsGroup.MinFirstPaymentAmount = request.subscriptionGroup.MinFirstPaymentAmount;
        subscriptionsGroup.MinFirstPaymentAmountUnit = request.subscriptionGroup.MinFirstPaymentAmountUnit;
        subscriptionsGroup.MinimumSubscriptionAmount = request.subscriptionGroup.MinimumSubscriptionAmount ?? 0;
        subscriptionsGroup.Description = request.subscriptionGroup.Description;

        var ranges = request.subscriptionGroup.SubscriptionPremium?.Ranges?.Select(
            range => new PremiumRange
            {
                UpperBound = range.UpperBound,
                Percentage = range.Percentage
            }).ToList() ?? new List<PremiumRange>();

        SubscriptionPremium? premium = null;
        if (subscriptionsGroup.SubscriptionPremiumId != null)
        {
            premium = await dataService.SubscriptionPremiums.FirstOrDefaultAsync(x => x.Id == request.subscriptionGroup.SubscriptionPremiumId);
            if (premium != null)
            {
                premium.Ranges.Clear();
                premium.Ranges.AddRange(ranges);
            }
        }
        else
        {
            subscriptionsGroup.SubscriptionPremium = new SubscriptionPremium { Ranges = ranges };
        }

        await dataService.SaveAsync(cancellationToken);
    }
}
