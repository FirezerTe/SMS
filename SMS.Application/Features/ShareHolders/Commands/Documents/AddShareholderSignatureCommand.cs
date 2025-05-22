using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record AddShareholderSignatureCommand(int ShareholderId, IFormFile File) : IRequest<Document>;

internal class AddShareholderSignatureCommandHandler : IRequestHandler<AddShareholderSignatureCommand, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public AddShareholderSignatureCommandHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }

    public async Task<Document> Handle(AddShareholderSignatureCommand request, CancellationToken cancellationToken)
    {
        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });

        var currentSignature = await dataService.ShareholderDocuments
            .Where(sd => sd.ShareholderId == request.ShareholderId &&
            sd.DocumentType == Domain.Enums.DocumentType.ShareholderSignature).ToListAsync();

        dataService.ShareholderDocuments.RemoveRange(currentSignature);

        dataService.ShareholderDocuments.Add(new ShareholderDocument()
        {
            ShareholderId = request.ShareholderId,
            DocumentType = Domain.Enums.DocumentType.ShareholderSignature,
            DocumentId = document.Id,
            FileName = document.FileName
        });

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}