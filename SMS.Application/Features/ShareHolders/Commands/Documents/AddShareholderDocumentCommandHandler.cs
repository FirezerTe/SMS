using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application;

public record AddShareholderDocumentCommand(int ShareholderId, DocumentType DocumentType, IFormFile File) : IRequest<Document>;

public class AddShareholderDocumentCommandHandler : IRequestHandler<AddShareholderDocumentCommand, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public AddShareholderDocumentCommandHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }
    public async Task<Document> Handle(AddShareholderDocumentCommand request, CancellationToken cancellationToken)
    {
        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });

        if (request.DocumentType == DocumentType.ShareholderPicture
            || request.DocumentType == DocumentType.ShareholderSignature
            || request.DocumentType == DocumentType.BirthCertificate
            || request.DocumentType == DocumentType.MarriageCertificate)
        {
            var currentPhoto = await dataService.ShareholderDocuments.Where(sd => sd.ShareholderId == request.ShareholderId && sd.DocumentType == request.DocumentType).ToListAsync();

            dataService.ShareholderDocuments.RemoveRange(currentPhoto);
        }

        dataService.ShareholderDocuments.Add(new ShareholderDocument()
        {
            ShareholderId = request.ShareholderId,
            DocumentType = request.DocumentType,
            DocumentId = document.Id,
            FileName = document.FileName
        });

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}
