using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record AddShareholderPhotoCommand(int ShareholderId, IFormFile File) : IRequest<Document>;

internal class AddShareholderPhotoCommandHandler : IRequestHandler<AddShareholderPhotoCommand, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public AddShareholderPhotoCommandHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }

    public async Task<Document> Handle(AddShareholderPhotoCommand request, CancellationToken cancellationToken)
    {
        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });

        var currentPhoto = await dataService.ShareholderDocuments
            .Where(sd => sd.ShareholderId == request.ShareholderId &&
            sd.DocumentType == Domain.Enums.DocumentType.ShareholderPicture).ToListAsync();

        dataService.ShareholderDocuments.RemoveRange(currentPhoto);

        dataService.ShareholderDocuments.Add(new ShareholderDocument()
        {
            ShareholderId = request.ShareholderId,
            DocumentType = Domain.Enums.DocumentType.ShareholderPicture,
            DocumentId = document.Id,
            FileName = document.FileName
        });

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}