using MediatR;

namespace SMS.Application
{
    public record SubscriptionApprovalStatusChangedCommand(): IRequest;
    public class SubscriptionApprovalStatusChangedCommandHandler : IRequestHandler<SubscriptionApprovalStatusChangedCommand>
    {
        public Task Handle(SubscriptionApprovalStatusChangedCommand request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
