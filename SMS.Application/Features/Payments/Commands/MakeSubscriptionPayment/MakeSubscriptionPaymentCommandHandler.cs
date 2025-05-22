using MediatR;
using SMS.Application.Security;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdatePayment)]
public record MakeSubscriptionPaymentCommand(NewPaymentDto payment) : IRequest;

public class MakeSubscriptionPaymentCommandHandler : IRequestHandler<MakeSubscriptionPaymentCommand>
{
    private readonly IDataService dataService;
    private readonly IPaymentService paymentService;

    public MakeSubscriptionPaymentCommandHandler(IDataService dataService, IPaymentService paymentService)
    {
        this.dataService = dataService;
        this.paymentService = paymentService;
    }

    public async Task Handle(MakeSubscriptionPaymentCommand request, CancellationToken cancellationToken)
    {
        await paymentService.AddNewPaymentAndSave(request.payment, cancellationToken);
    }
}
