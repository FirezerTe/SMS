using Microsoft.AspNetCore.Mvc;
using SMS.Application.Features.Allocation.Queries.AlocationForEachShareholder;

namespace SMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionAllocationsController : BaseController<SubscriptionAllocationsController>
    {

        [HttpGet("{id}", Name = "GetSubscriptionAllocationByID")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<GetSubscriptionAllocationQuery>> GetSubscriptionAllocationByID(int id)
        {
            var dtos = await mediator.Send(new GetSubscriptionAllocationQuery { ShareholderId = id });
            return Ok(dtos);
        }
    }
}
