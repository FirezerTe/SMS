using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application;

namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentsController : BaseController<SubscriptionsController>
{
    [HttpPost("add", Name = "MakePayment")]
    [ProducesResponseType(200)]
    public async Task MakePayment([FromBody] MakeSubscriptionPaymentCommand command)
    {
        await mediator.Send(command);
    }

    [HttpPost("update", Name = "UpdatePayment")]
    [ProducesResponseType(200)]
    public async Task UpdatePayment([FromBody] UpdateSubscriptionPaymentCommand command)
    {
        await mediator.Send(command);
    }

    [HttpGet("subscription/{id}", Name = "GetSubscriptionPayments")]
    [ProducesResponseType(200)]
    public async Task<SubscriptionPayments> GetSubscriptionPayments(int id)
    {
        return await mediator.Send(new GetSubscriptionPaymentsQuery(id));
    }

    [HttpPost("{id}/payment-receipt", Name = "UploadSubscriptionPaymentReceipt")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> UploadSubscriptionPaymentReceipt(int id, [FromForm] UploadPaymentReceiptDto document)
    {
        var command = new AddSubscriptionPaymentReceiptCommand(id, document.File);
        await mediator.Send(command);

        return Ok();
    }

    [HttpPost("new-adjustment", Name = "AddNewAdjustment")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> AddNewAdjustment(AddPaymentAdjustmentCommand adjustment)
    {
        await mediator.Send(adjustment);
        return Ok();
    }

    [HttpPost("update-adjustment", Name = "UpdatePaymentAdjustment")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> UpdatePaymentAdjustment(UpdatePaymentAdjustmentCommand adjustment)
    {
        await mediator.Send(adjustment);
        return Ok();
    }
}
