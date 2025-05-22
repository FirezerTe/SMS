
using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application;


namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DocumentsController : BaseController<DocumentsController>
{
    [HttpGet("{id?}", Name = "Get")]
    [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
    [ResponseCache(Duration = 86400, Location = ResponseCacheLocation.Client)]
    public async Task<FileResult> Get(string id)
    {
        var doc = await mediator.Send(new GetDocumentQuery(id));
        return File(doc.Content, doc.ContentType, doc.FileName);
    }

    [HttpGet("root-path", Name = "DocumentRootPath")]
    [ProducesResponseType(typeof(DocumentEndpointRootPath), StatusCodes.Status200OK)]
    public Task<DocumentEndpointRootPath> DocumentRootPath()
    {
        return Task.FromResult(new DocumentEndpointRootPath(this.GetDocumentRootPath()));
    }


    [HttpGet("{id?}/download", Name = "DownloadDocument")]
    [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
    [ResponseCache(Duration = 86400, Location = ResponseCacheLocation.Client)]
    public async Task<FileResult> DownloadDocument(string id)
    {
        var doc = await mediator.Send(new GetDocumentQuery(id));
        return File(doc.Content, doc.ContentType, doc.FileName);
    }
}
