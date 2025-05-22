using MediatR;
using Microsoft.AspNetCore.Http;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdatePayment)]
public record AddSubscriptionPaymentReceiptCommand(int PaymentId, IFormFile File) : IRequest<Document>;

public class AddSubscriptionPaymentReceiptCommandHandler : IRequestHandler<AddSubscriptionPaymentReceiptCommand, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public AddSubscriptionPaymentReceiptCommandHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }

    public async Task<Document> Handle(AddSubscriptionPaymentReceiptCommand request, CancellationToken cancellationToken)
    {
        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });


        dataService.PaymentReceipts.Add(new SubscriptionPaymentReceipt()
        {
            PaymentId = request.PaymentId,
            DocumentId = document.Id,
            IsImage = document.ContentType.StartsWith("image/"),
            FileName = document.FileName
        });

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}
