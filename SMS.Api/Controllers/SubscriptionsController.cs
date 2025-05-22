using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application;

namespace SMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionsController : BaseController<SubscriptionsController>
    {

        [HttpPost("add", Name = "AddSubscription")]
        [ProducesResponseType(200)]
        public async Task AddSubscription([FromBody] AddSubscriptionCommand command)
        {
            await mediator.Send(command);
        }

        [HttpPost("update", Name = "UpdateSubscription")]
        [ProducesResponseType(200)]
        public async Task UpdateSubscription([FromBody] UpdateSubscriptionCommand command)
        {
            await mediator.Send(command);
        }


        [HttpGet("shareholder/{id}/all", Name = "GetShareholderSubscriptions")]
        [ProducesResponseType(200)]
        public async Task<ShareholderSubscriptions> GetShareholderSubscriptions(int id)
        {
            return await mediator.Send(new GetShareholderSubscriptionsQuery(id));
        }

        [HttpGet("shareholder/{id}/subscriptions-summary", Name = "GetShareholderSubscriptionSummary")]
        [ProducesResponseType(200)]
        public async Task<ShareholderSubscriptionsSummary> GetShareholderSubscriptionSummary(int id)
        {
            return await mediator.Send(new ShareholderSubscriptionsSummaryQuery(id));
        }

        [HttpPost("attachments/subscription-form", Name = "AttachSubscriptionForm")]
        [ProducesResponseType(200)]
        public async Task<DocumentMetadataDto> AttachSubscriptionForm([FromForm] UploadSubscriptionDocumentDto document)
        {
            var command = new AddSubscriptionFormCommand(document.SubscriptionId, document.File);
            var doc = await mediator.Send(command);

            return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
        }

        [HttpPost("attachments/premium-payment-receipt", Name = "AttachPremiumPaymentReceipt")]
        [ProducesResponseType(200)]
        public async Task<DocumentMetadataDto> AttachPremiumPaymentReceipt([FromForm] UploadSubscriptionDocumentDto document)
        {
            var command = new AddSubscriptionPremiumPaymentReceipt(document.SubscriptionId, document.File);
            var doc = await mediator.Send(command);

            return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
        }

        [HttpGet("shareholder/{shareholderId}/subscriptions-documents", Name = "GetShareholderSubscriptionDocuments")]
        [ProducesResponseType(200)]
        public async Task<List<SubscriptionDocumentDto>> GetShareholderSubscriptionDocuments(int shareholderId)
        {
            return await mediator.Send(new GetAllShareholderSubscriptionDocumentsQuery(shareholderId));
        }
    }
}
