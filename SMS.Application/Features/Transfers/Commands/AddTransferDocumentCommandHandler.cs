using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;


[Authorize(Policy = AuthPolicy.CanCreateOrUpdatePayment)]
public record AddTransferDocumentCommand(int TransferId, TransferDocumentType DocumentType, IFormFile File) : IRequest<Document>;


public class AddTransferDocumentCommandHandler : IRequestHandler<AddTransferDocumentCommand, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public AddTransferDocumentCommandHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }

    public async Task<Document> Handle(AddTransferDocumentCommand request, CancellationToken cancellationToken)
    {
        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });

        if (request.DocumentType == TransferDocumentType.Agreement)
        {
            var existingDocuments = await dataService.TransferDocuments.Where(d => d.TransferId == request.TransferId && d.DocumentType == TransferDocumentType.Agreement).ToListAsync();
            dataService.TransferDocuments.RemoveRange(existingDocuments);
        }

        if (request.DocumentType == TransferDocumentType.CapitalGainTaxReceipt)
        {
            var existingDocuments = await dataService.TransferDocuments.Where(d => d.TransferId == request.TransferId && d.DocumentType == TransferDocumentType.CapitalGainTaxReceipt).ToListAsync();
            dataService.TransferDocuments.RemoveRange(existingDocuments);
        }


        dataService.TransferDocuments.Add(new TransferDocument()
        {
            TransferId = request.TransferId,
            DocumentType = request.DocumentType,
            DocumentId = document.Id,
            IsImage = document.ContentType.StartsWith("image/"),
            FileName = document.FileName
        });

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}

