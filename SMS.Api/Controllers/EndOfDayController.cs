using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using SMS.Application.Features.EndOfDay.Commands;
using SMS.Application.Features.EndOfDay.Models;
using SMS.Application.Features.EndOfDay.Queries;
using SMS.Common.Services.RigsWeb;
using EndOfDayDto = SMS.Common.Services.RigsWeb.EndOfDayDto;

namespace SMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EndOfDayController : BaseController<EndOfDayController>
    {
        [HttpGet("GetDailyTransactions", Name = "GetDailyTransactions")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<DailyTransactionListResponse>> GetDailyTransactions(DateOnly transactionDate, int PageSize, int PageNumber)
        {
            var isWebRunning = await mediator.Send(new GetWebServiceStatus());
            if (isWebRunning == true)
            {
                var dtos = await mediator.Send(new GetDailyTransactionFromSMSQuery { TransactionDate = transactionDate, PageSize = PageSize, PageNumber = PageNumber });

                return Ok(dtos);
            }
            throw new Exception("Network Connection is Down");

        }

        [HttpGet("GetAllTransactions", Name = "GetAllTransactions")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<EndOfDayDto>> GetAllTransactions()
        {
            var dtos = await mediator.Send(new GetDailyTransactionFromSMSQuery());
            return Ok(dtos);
        }

        [HttpPost("ProcessEod", Name = "ProcessEod")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EndOfDayDto>>> ProcessEod([FromBody] List<EndOfDayDto> transactionListResponse, DateOnly date, string description)
        {
            var processId = await mediator.Send(new ProcessEodCommand()
            {
                DailyTransactionListEOD = transactionListResponse,
                Date = date,
                Description = description
            });
            return Ok(processId);
        }

        [HttpGet("GetCoreTransaction", Name = "GetCoreTransaction")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<RigsTransaction>>> GetCoreTransaction(DateOnly transactionDate)
        {
            var core = await mediator.Send(new GetDailyTransactionFromSMSQuery
            {
                TransactionDate = transactionDate,

            });

            return Ok(core);
        }

        [HttpPost("ExportToCsvFile", Name = "ExportToCsvFile")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<ProcessEodDto>> ExportToCsvFile(List<ProcessEodDto> transactionListResponse)
        {

            using (var writer = new StreamWriter("transactionListResponse.csv"))
            using (var csv = new CsvWriter(writer, System.Globalization.CultureInfo.InvariantCulture))
            {
                csv.WriteRecords(transactionListResponse);
            }
            var fileBytes = System.IO.File.ReadAllBytes("transactionListResponse.csv");
            return File(fileBytes, "text/csv", "transactionListResponse.csv");
        }
    }
}