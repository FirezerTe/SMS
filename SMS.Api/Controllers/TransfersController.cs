using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application;
using SMS.Domain;

namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransfersController : BaseController<TransfersController>
{
    [HttpPost("create1", Name = "CreateNewTransfer")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> CreateNewTransfer([FromBody] AddNewTransferCommand payload)
    {
        await mediator.Send(payload);
        return Ok();
    }

    [HttpPost("update", Name = "UpdateTransfer")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> UpdateTransfer([FromBody] UpdateTransferCommand payload)
    {
        await mediator.Send(payload);
        return Ok();
    }

    [HttpPost("transfer-payments", Name = "SavePaymentTransfers")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> SavePaymentTransfers([FromBody] SavePaymentTransfersCommand payload)
    {
        await mediator.Send(payload);
        return Ok();
    }

    [HttpDelete("{id}/delete", Name = "DeleteTransfer")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> DeleteTransfer(int id)
    {
        await mediator.Send(new DeleteTransferCommand(id));
        return Ok();
    }

    [HttpGet("shareholder-transfers/{shareholderId}", Name = "GetTransfersByShareholderId")]
    [ProducesResponseType(200)]
    public async Task<List<TransferDto>> GetTransfersByShareholderId(int shareholderId)
    {
        return await mediator.Send(new GetShareholderTransfersCommand(shareholderId));
    }

    [HttpPost("{transferId}/document/{documentType}", Name = "UploadTransferDocument")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> UploadTransferDocument(int transferId, TransferDocumentType documentType, [FromForm] UploadTransferDocumentDto document)
    {
        var command = new AddTransferDocumentCommand(transferId, documentType, document.File);
        await mediator.Send(command);

        return Ok();
    }
}
