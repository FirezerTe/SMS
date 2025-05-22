using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application.Features.Certificate.Command;
using SMS.Application.Features.Certificate.Queries;
using SMS.Application.Features.Certificate.Queries.Certificate;

namespace SMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificateController : BaseController<CertificateController>
    {
        [HttpPost("activate-certificate", Name = "ActivateCertificate")]
        [ProducesResponseType(200)]
        public Task ActivateCertificate([FromBody] CertificateDto payload)
        {
            return mediator.Send(new ActivateShareholderCertificateCommand(payload.Id));
        }

        [HttpPost("deactivate-certificate", Name = "DeactivateCertificate")]
        [ProducesResponseType(200)]
        public Task DeactivateCertificate([FromBody] CertificateDto payload)
        {
            return mediator.Send(new DeactivateShareholderCertificateCommand(payload.Id));
        }

        [HttpGet("{id}/certficates", Name = "GetShareholderCertificates")]
        [ProducesResponseType(200)]
        public async Task<CertificateSummeryDto> GetShareholderCertificates(int id)
        {
            var command = new GetShareholderCertificateQuery(ShareholderId: id);
            return await mediator.Send(command);
        }

        [HttpPost("prepare", Name = "PrepareCertificate")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        public async Task<ActionResult<int>> PrepareShareholderCertificate([FromBody] PrepareShareholderCertificateCommand certificateInfo)
        {
            var shareholderId = await mediator.Send(certificateInfo);
            return Ok(shareholderId);
        }
        [HttpPost("certificate-detail/{id}/document", Name = "UploadCertificateIssueDocument")]
        [ProducesResponseType(200)]
        public async Task<ActionResult> UploadCertificateIssueDocument(int id, [FromForm] UploadCertificateIssueDocumentDto document)
        {
            var command = new AddShareholderCertficateAttachmentsCommand(id, document.File);
            await mediator.Send(command);

            return Ok();
        }
        [HttpPost("update", Name = "UpdateShareholderCertificate")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> UpdateShareholderCertificate([FromBody] UpdateShareholderCertificateCommand basicInfo)
        {
            var shareholderId = await mediator.Send(basicInfo);
            return Ok(shareholderId);
        }
    }
}