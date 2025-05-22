using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record AddBlockShareholderAttachmentCommand(int ShareholderId, IFormFile File) : IRequest<Document>;

public class AddBlockShareholderAttachmentHandler : IRequestHandler<AddBlockShareholderAttachmentCommand, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public AddBlockShareholderAttachmentHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }


    public async Task<Document> Handle(AddBlockShareholderAttachmentCommand request, CancellationToken cancellationToken)
    {
        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });

        var blockedShareholder = await dataService.BlockedShareholders.FirstOrDefaultAsync(b => b.Id == request.ShareholderId);
        if (blockedShareholder == null) throw new NotFoundException();

        if (blockedShareholder.Attachments == null)
        {
            blockedShareholder.Attachments = new List<BlockedShareholderAttachment>();
        }

        blockedShareholder.Attachments.Add(new BlockedShareholderAttachment
        {
            DocumentId = document.Id,
            IsImage = document.ContentType.StartsWith("image/"),
            FileName = document.FileName
        });

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}
