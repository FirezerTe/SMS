using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application;
using SMS.Application.Lookups;
using SMS.Application.Lookups.Queries;
using SMS.Common;

namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LookupsController : BaseController<LookupsController>
{
    private readonly IDividendService dividendService;

    public LookupsController(IDividendService dividendService) : base()
    {
        this.dividendService = dividendService;
    }

    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<LookupsDto> GetAllLookups()
    {
        var shareholderTypes = await mediator.Send(new GetShareholderTypesQuery());
        var countries = await mediator.Send(new GetCountriesQuery());
        var branch = await mediator.Send(new GetBranchQuery());
        var district = await mediator.Send(new GetDistrictQuery());
        var transferTypes = await mediator.Send(new GetTransferTypesQuery());
        var transferDividendTerms = await mediator.Send(new GetTransferDividendTermsQuery());
        var paymentMethods = await mediator.Send(new GetPaymentMethodsQuery());
        var paymentTypes = await mediator.Send(new GetPaymentTypesQuery());
        var foreignCurrencyTypes = await mediator.Send(new GetForeignCurrencyTypesQuery());
        var shareholderStatuses = await mediator.Send(new GetShareholderStatusQuery());
        var shareholderBlockTypes = await mediator.Send(new GetShareholderBlockTypesQuery());
        var shareholderBlockReasons = await mediator.Send(new GetShareholderBlockReasonsQuery());
        var currentDividendPeriod = await dividendService.GetCurrentDividendPeriod();
        var certificateTypes = await mediator.Send(new GetCertificateTypeQuery());

        return new LookupsDto
        {
            ShareholderTypes = shareholderTypes,
            Branch = branch,
            District = district,
            Countries = countries,
            TransferTypes = transferTypes,
            TransferDividendTerms = transferDividendTerms,
            PaymentMethods = paymentMethods,
            PaymentTypes = paymentTypes,
            ForeignCurrencyTypes = foreignCurrencyTypes,
            ShareholderStatuses = shareholderStatuses,
            ShareholderBlockTypes = shareholderBlockTypes,
            ShareholderBlockReasons = shareholderBlockReasons,
            CurrentDividendPeriod = new DividendPeriodDto(currentDividendPeriod.Id,
                                                          currentDividendPeriod.StartDate,
                                                          currentDividendPeriod.EndDate,
                                                          currentDividendPeriod.DayCount,
                                                          currentDividendPeriod.Year),
           CertficateTypes = certificateTypes
        };
    }

}
