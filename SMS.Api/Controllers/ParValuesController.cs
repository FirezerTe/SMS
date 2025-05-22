using Microsoft.AspNetCore.Mvc;
using SMS.Application;

namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ParValuesController : BaseController<ParValuesController>
{
    [HttpPost("CreateParValue", Name = "CreateParValue")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<int>> CreateParValue([FromBody] CreateParValueCommand command)
    {
        var parValueId = await mediator.Send(command);
        return Ok(parValueId);
    }

    [HttpPost("update", Name = "UpdateParValue")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> UpdateParValue([FromBody] UpdateParValueCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpGet("parvalues", Name = "GetAllParValues")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<ParValues>> GetAllParValues()
    {
        var parValues = await mediator.Send(new GetAllParValuesQuery());

        return Ok(parValues);
    }

    [HttpPost("submit-for-approval", Name = "SubmitParValueForApproval")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> SubmitParValueForApproval([FromBody] SubmitParValueApprovalRequestCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpPost("approve", Name = "ApproveParValue")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> ApproveParValue([FromBody] ApproveParValueCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpPost("reject", Name = "RejectParValue")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> RejectParValue([FromBody] RejectParValueCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }
}
