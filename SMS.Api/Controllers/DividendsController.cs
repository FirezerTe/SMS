using Microsoft.AspNetCore.Mvc;
using SMS.Api.Controllers;
using SMS.Api.Dtos;
using SMS.Application;
using SMS.Common;

namespace SMS.Api;

[Route("api/[controller]")]
[ApiController]
public class DividendsController : BaseController<DividendsController>
{
    [HttpGet("{shareholderId}", Name = "GetShareholderDividends")]
    [ProducesResponseType(200)]
    public async Task<ShareholderDividendsResult> GetShareholderDividends(int shareholderId)
    {
        return await mediator.Send(new GetShareholderDividendsQuery(shareholderId));
    }

    [HttpPost("evaluate-dividend-decision", Name = "evaluateDividendDecision")]
    [ProducesResponseType(200)]
    public Task<DividendComputationResults> EvaluateDividendDecision([FromBody] ComputeDividendDecisionCommand command)
    {
        return mediator.Send(command);
    }

    [HttpPost("submitDividendDecision", Name = "submitDividendDecision")]
    [ProducesResponseType(200)]
    public Task SubmitDividendDecision([FromBody] SaveDividendDecisionCommand command)
    {
        return mediator.Send(command);
    }

    [HttpGet("dividend-decisions-summary", Name = "GetDividendDecisionsSummary")]
    [ProducesResponseType(200)]
    public async Task<GetDividendDecisionsSummaryQueryResult> GetDividendDecisionsSummary()
    {
        return await mediator.Send(new GetDividendDecisionsSummaryQuery());
    }

    [HttpPost("decision-attachment/{id}", Name = "AttachDividendDecisionDocument")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> AttachDividendDecisionDocument(int id, [FromForm] UploadDividendDecisionDocumentDto document)
    {
        var command = new SaveDividendDecisionAttachmentCommand(id, document.File);
        await mediator.Send(command);

        return Ok();
    }

    //Dividend Setup
    [HttpGet("setups", Name = "GetSetups")]
    [ProducesResponseType(200)]
    public async Task<List<DividendSetupDto>> GetSetups()
    {
        return await mediator.Send(new GetDividendSetupsQuery());
    }

    [HttpPost("add-dividend-setup", Name = "AddNewDividendSetup")]
    [ProducesResponseType(200)]
    public Task AddNewDividendSetup([FromBody] AddDividendSetupCommand setup)
    {
        return mediator.Send(setup);
    }

    [HttpPost("update-dividend-setup", Name = "UpdateDividendSetup")]
    [ProducesResponseType(200)]
    public Task UpdateDividendSetup([FromBody] UpdateDividendSetupCommand setup)
    {
        return mediator.Send(setup);
    }

    [HttpPost("compute-dividend-rate", Name = "ComputeDividendRate")]
    [ProducesResponseType(200)]
    public Task ComputeDividendRate([FromBody] ComputeDividendRateCommand command)
    {
        return mediator.Send(command);
    }

    [HttpGet("setup-dividends/{setupId}", Name = "GetSetupDividends")]
    [ProducesResponseType(200)]
    public async Task<SetupDividendsDto> GetSetupDividends(int setupId, int pageNumber = 1, int pageSize = 25)
    {
        return await mediator.Send(new GetSetupDividendsQuery(setupId, pageNumber, pageSize));
    }

    [HttpGet("shareholder-dividend-detail/{setupId}/{shareholderId}", Name = "GetShareholderDividendDetail")]
    [ProducesResponseType(200)]
    public async Task<GetShareholderDividendDetailResult> GetShareholderDividendDetail(int setupId, int shareholderId)
    {
        return await mediator.Send(new GetShareholderDividendDetailQuery(setupId, shareholderId));
    }

    [HttpPost("approve", Name = "ApproveDividendSetup")]
    [ProducesResponseType(200)]
    public Task ApproveDividendSetup([FromBody] ApproveDividendSetupCommand command)
    {
        return mediator.Send(command);
    }

    [HttpPost("tax-pending-decisions", Name = "TaxPendingDecisions")]
    [ProducesResponseType(200)]
    public Task TaxPendingDecisions([FromBody] TaxPendingDecisionsCommand command)
    {
        return mediator.Send(command);
    }

    //Dividend periods
    [HttpGet("periods", Name = "GetDividendPeriods")]
    [ProducesResponseType(200)]
    public async Task<List<DividendPeriodDto>> GetDividendPeriods()
    {
        return await mediator.Send(new GetDividendPeriodsQuery());
    }
}
