using MediatR;
using Microsoft.AspNetCore.Http;
using SMS.Domain;

namespace SMS.Application;

// [Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholder)]
public class AddDocumentCommand : IRequest<Document>
{
    public IFormFile File { get; set; }
}

internal class AddDocumentCommandHandler : IRequestHandler<AddDocumentCommand, Document>
{
    private readonly IDocumentUploadService documentUploadService;

    public AddDocumentCommandHandler(IDocumentUploadService documentUploadService)
    {
        this.documentUploadService = documentUploadService;
    }


    public async Task<Document> Handle(AddDocumentCommand request, CancellationToken cancellationToken)
    {
        return await documentUploadService.Upload(request.File, cancellationToken);
    }
}
