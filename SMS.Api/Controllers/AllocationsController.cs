using Microsoft.AspNetCore.Mvc;
using SMS.Application;

namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AllocationsController : BaseController<AllocationsController>
{
    [HttpPost("create", Name = "CreateAllocation")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<int>> CreateAllocation([FromBody] CreateAllocationCommand command)
    {
        var allocationId = await mediator.Send(command);
        return Ok(allocationId);
    }


    [HttpPut("update", Name = "UpdateAllocation")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<int>> UpdateAllocation([FromBody] UpdateAllocationCommand command)
    {
        var allocationId = await mediator.Send(command);
        return Ok(allocationId);
    }

    [HttpGet("all", Name = "GetAllAllocations")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<Allocations>> GetAllAllocations()
    {
        var allocations = await mediator.Send(new GetAllAllocationsQuery());

        return Ok(allocations);
    }

    [HttpPost("submit-for-approval", Name = "SubmitAllocationForApproval")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> SubmitAllocationForApproval([FromBody] SubmitAllocationApprovalRequestCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpPost("approve", Name = "ApproveAllocation")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> ApproveAllocation([FromBody] ApproveAllocationCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpPost("reject", Name = "RejectAllocation")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> RejectAllocation([FromBody] RejectAllocationCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpGet("summaries", Name = "GetAllocationSummaries")]
    [ProducesResponseType(200)]
    public async Task<List<AllocationSubscriptionSummaryDto>> GetAllocationSummaries()
    {
        return await mediator.Send(new GetAllocationSummariesQuery());
    }

    [HttpGet("shareholder/{shareholderId}/allocations", Name = "GetAllShareholderAllocations")]
    [ProducesResponseType(200)]
    public async Task<List<ShareholderAllocationDto>> GetAllShareholderAllocations(int shareholderId)
    {
        return await mediator.Send(new GetAllShareholderAllocationsQuery(shareholderId));
    }

    //Bank
    [HttpPost("bank-allocation/set", Name = "SetBankAllocation")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> SetBankAllocation([FromBody] SetBankAllocationCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpGet("bank-allocation/all-allocations", Name = "GetAllBankAllocations")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<BankAllocations>> GetAllBankAllocations()
    {
        var bankAllocations = await mediator.Send(new GetAllBankAllocationsQuery());

        return Ok(bankAllocations);
    }

    [HttpPost("bank-allocation/submit-for-approval", Name = "SubmitBankAllocationForApproval")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> SubmitBankAllocationForApproval([FromBody] SubmitBankAllocationApprovalRequestCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpPost("bank-allocation/approve", Name = "ApproveBankAllocation")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> ApproveBankAllocation([FromBody] ApproveBankAllocationCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpPost("bank-allocation/reject", Name = "RejectBankAllocation")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> RejectBankAllocation([FromBody] RejectBankAllocationCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }
}
