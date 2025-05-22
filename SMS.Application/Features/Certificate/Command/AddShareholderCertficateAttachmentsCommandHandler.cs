using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application.Features.Certificate.Command;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record AddShareholderCertficateAttachmentsCommand(int certificateId, IFormFile File) : IRequest<Document>;

public class AddShareholderCertficateAttachmentsCommandHandler : IRequestHandler<AddShareholderCertficateAttachmentsCommand, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public AddShareholderCertficateAttachmentsCommandHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }


    public async Task<Document> Handle(AddShareholderCertficateAttachmentsCommand request, CancellationToken cancellationToken)
    {
        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });

        var shareholderCertificate = await dataService.Certficates.FirstOrDefaultAsync(b => b.Id == request.certificateId);
        if (shareholderCertificate == null) throw new NotFoundException();

        if (shareholderCertificate.Attachments == null)
        {
            shareholderCertificate.Attachments = new List<CertificateAttachments>();
        }

        shareholderCertificate.Attachments.Add(new CertificateAttachments
        {
            DocumentId = document.Id,
            IsImage = document.ContentType.StartsWith("image/"),
            FileName = document.FileName
        });

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}