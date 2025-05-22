using Microsoft.AspNetCore.Mvc;
using SMS.Application;

namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SubscriptionGroupsController : BaseController<SubscriptionGroupsController>
{
    [HttpPost("create", Name = "CreateSubscriptionGroup")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> CreateSubscriptionGroup([FromBody] CreateSubscriptionGroupCommand payload)
    {
        await mediator.Send(payload);
        return Ok();
    }

    [HttpPost("update", Name = "UpdateSubscriptionGroup")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> UpdateSubscriptionGroup([FromBody] UpdateSubscriptionGroupCommand payload)
    {
        await mediator.Send(payload);
        return Ok();
    }

    [HttpGet("{id}", Name = "GetSubscriptionGroupById")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<SubscriptionGroupInfo>> GetSubscriptionGroupById(int id)
    {
        var subscriptionGroup = await mediator.Send(new GetSubscriptionGroupDetailQuery(id));
        return Ok(subscriptionGroup);
    }

    [HttpGet("all", Name = "GetAllSubscriptionGroups")]
    [ProducesResponseType(200)]

    public async Task<ActionResult<List<SubscriptionGroupInfo>>> GetAllSubscriptionGroups()
    {
        var subscriptionGroups = await mediator.Send(new GetAllSubscriptionGroupQuery());

        return Ok(subscriptionGroups);
    }

}
