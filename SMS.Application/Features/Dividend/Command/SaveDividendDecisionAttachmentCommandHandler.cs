using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Exceptions;
using SMS.Domain;

namespace SMS.Application;

public record SaveDividendDecisionAttachmentCommand(int DecisionId, IFormFile File) : IRequest<Document>;

public class SaveDividendDecisionAttachmentCommandHandler : IRequestHandler<SaveDividendDecisionAttachmentCommand, Document>
{
    private readonly IDataService dataService;
    private readonly IMediator mediator;

    public SaveDividendDecisionAttachmentCommandHandler(IDataService dataService, IMediator mediator)
    {
        this.dataService = dataService;
        this.mediator = mediator;
    }

    public async Task<Document> Handle(SaveDividendDecisionAttachmentCommand request, CancellationToken cancellationToken)
    {
        var document = await mediator.Send(new AddDocumentCommand()
        {
            File = request.File
        });

        var decision = await dataService.DividendDecisions.FirstOrDefaultAsync(d => d.Id == request.DecisionId);
        if (decision == null) throw new NotFoundException();

        decision.AttachmentDocumentId = document.Id;
        decision.AttachmentDocumentFileName = document.FileName;

        await dataService.SaveAsync(cancellationToken);

        return document;
    }
}
