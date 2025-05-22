using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public record AddSubscriptionPremiumPaymentReceipt(int subscriptionId, IFormFile File) : IRequest<Document>;

public class AddSubscriptionPremiumPaymentReceiptHandler : IRequestHandler<AddSubscriptionPremiumPaymentReceipt, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public AddSubscriptionPremiumPaymentReceiptHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }

    public async Task<Document> Handle(AddSubscriptionPremiumPaymentReceipt request, CancellationToken cancellationToken)
    {
        var existingReceipt = await dataService.SubscriptionDocuments.FirstOrDefaultAsync(d => d.SubscriptionId == request.subscriptionId && d.DocumentType == DocumentType.SubscriptionPremiumPaymentReceipt);
        if (existingReceipt != null)
        {
            dataService.SubscriptionDocuments.Remove(existingReceipt);
        }

        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });

        dataService.SubscriptionDocuments.Add(new SubscriptionDocument()
        {
            SubscriptionId = request.subscriptionId,
            DocumentId = document.Id,
            DocumentType = DocumentType.SubscriptionPremiumPaymentReceipt,
            IsImage = document.ContentType.StartsWith("image/"),
            FileName = document.FileName
        });

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}
