using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public record AddSubscriptionFormCommand(int SubscriptionId, IFormFile File) : IRequest<Document>;

public class AddSubscriptionFormHandler : IRequestHandler<AddSubscriptionFormCommand, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public AddSubscriptionFormHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }

    public async Task<Document> Handle(AddSubscriptionFormCommand request, CancellationToken cancellationToken)
    {
        var existingForm = await dataService.SubscriptionDocuments.FirstOrDefaultAsync(d => d.SubscriptionId == request.SubscriptionId && d.DocumentType == DocumentType.SubscriptionForm);
        if (existingForm != null)
        {
            dataService.SubscriptionDocuments.Remove(existingForm);
        }


        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });

        dataService.SubscriptionDocuments.Add(new SubscriptionDocument()
        {
            SubscriptionId = request.SubscriptionId,
            DocumentId = document.Id,
            DocumentType = DocumentType.SubscriptionForm,
            IsImage = document.ContentType.StartsWith("image/"),
            FileName = document.FileName
        });

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}
