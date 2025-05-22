using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application;
using SMS.Domain.Enums;

namespace SMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ShareholdersController : BaseController<ShareholdersController>
{
    [HttpGet("all", Name = "GetAllShareholders")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<ShareholderSearchResult>> GetAllShareholders(ApprovalStatus status, int pageNumber = 1, int pageSize = 20)
    {
        var searchResult = await mediator.Send(new GetShareholdersListQuery(status, pageNumber, pageSize));
        foreach (var shareholder in searchResult.Items)
            shareholder.PhotoUrl = GetDocumentUrl(shareholder.PhotoId);

        return searchResult;
    }

    [HttpGet("{id}", Name = "GetShareholderById")]
    [ProducesResponseType(200)]
    public async Task<ShareholderDetailsDto> GetShareholderById(int id)
    {
        var shareholder = await mediator.Send(new GetShareholderDetailQuery { Id = id });
        shareholder.PhotoUrl = GetDocumentUrl(shareholder.PhotoId);
        foreach (var family in shareholder.Families)
            foreach (var member in family.Members)
                member.PhotoUrl = GetDocumentUrl(member.PhotoId);

        return shareholder;
    }

    [HttpGet("{id}/info", Name = "GetShareholderInfo")]
    [ProducesResponseType(200)]
    public async Task<ShareholderInfo> GetShareholderInfo(int id, [FromQuery] Guid? version = null)
    {
        var shareholder = await mediator.Send(new GetShareholderInfoQuery(id, version));
        shareholder.PhotoUrl = GetDocumentUrl(shareholder.PhotoId);

        return shareholder;
    }

    [HttpPost("add", Name = "AddNewShareholder")]
    [ProducesResponseType(200)]
    [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
    public async Task<ActionResult<int>> AddNewShareholder([FromBody] CreateShareholderCommand basicInfo)
    {
        var shareholderId = await mediator.Send(basicInfo);
        return Ok(shareholderId);
    }

    [HttpPost("{id}", Name = "UpdateShareholder")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<int>> UpdateShareholder(int id, [FromBody] UpdateShareholderCommand basicInfo)
    {
        var shareholderId = await mediator.Send(basicInfo);
        return Ok(shareholderId);
    }

    //shareholders/1/addresses
    [HttpPost("{id}/addresses", Name = "AddShareholderAddress")]
    [ProducesResponseType(200)]

    public async Task<int> AddShareholderAddress(int id, [FromBody] AddressDto payload)
    {
        var command = new AddShareHolderAddressCommand(id, payload);
        return await mediator.Send(command);
    }

    [HttpPut("{id}/addresses", Name = "UpdateShareholderAddress")]
    [ProducesResponseType(200)]
    public async Task<int> UpdateShareholderAddress(int id, [FromBody] AddressDto payload)
    {
        var command = new UpdateShareholderAddressCommand(id, payload);
        return await mediator.Send(command);
    }

    [HttpGet("{id}/addresses", Name = "GetShareholderAddresses")]
    [ProducesResponseType(200)]
    public async Task<List<AddressDto>> GetShareholderAddresses(int id)
    {
        var command = new GetShareholderAddressesQuery() { ShareholderId = id };
        return await mediator.Send(command);
    }

    [HttpGet("{id}/documents", Name = "GetShareholderDocuments")]
    [ProducesResponseType(200)]
    public async Task<List<ShareholderDocumentDto>> GetShareholderDocuments(int id)
    {
        var command = new GetShareholderDocumentsQuery(ShareholderId: id);
        return await mediator.Send(command);
    }

    [HttpPost("{id}/contacts", Name = "AddShareholderContact")]
    [ProducesResponseType(200)]
    public async Task<int> AddShareholderContact(int id, [FromBody] ContactDto payload)
    {
        var command = new AddShareholderContactCommand(id, payload);

        return await mediator.Send(command);
    }

    [HttpPut("{id}/contacts", Name = "UpdateShareholderContact")]
    [ProducesResponseType(200)]
    public async Task<int> UpdateShareholderContact(int id, [FromBody] ContactDto payload)
    {
        var command = new UpdateShareholderContactCommand(id, payload);
        return await mediator.Send(command);
    }

    [HttpGet("{id}/contacts", Name = "GetShareholderContacts")]
    [ProducesResponseType(200)]
    public async Task<List<ContactDto>> GetShareholderContacts(int id, [FromQuery] Guid? version = null)
    {
        var command = new GetShareholderContactsQuery(ShareholderId: id, version);
        return await mediator.Send(command);
    }

    [HttpGet("typeahead-search", Name = "TypeaheadSearch")]
    [ProducesResponseType(200)]
    public async Task<List<ShareholderBasicInfo>> TypeaheadSearch(string name)
    {
        var command = new ShareholderTypeaheadSearchQuery() { Name = name };
        var shareholders = await mediator.Send(command);
        foreach (var shareholder in shareholders)
        {
            shareholder.PhotoUrl = GetDocumentUrl(shareholder.PhotoId);

        }
        return shareholders;
    }



    [HttpPost("{id}/families/add", Name = "AddFamilyMembers")]
    [ProducesResponseType(200)]
    public async Task<FamilyDto> AddFamilyMembers(int id, [FromBody] AddFamilyMembersRequest payload)
    {
        var members = new List<int>() { id };
        members.AddRange(payload.Members);
        var command = new AddFamilyMembersCommand(members, payload.FamilyId);
        return await mediator.Send(command);
    }

    [HttpPost("{id}/families/remove", Name = "RemoveFamilyMember")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> RemoveFamilyMember(int id, [FromBody] RemoveFamilyMembersRequest payload)
    {
        var command = new RemoveFamilyMemberCommand(payload.ShareholderId, payload.FamilyId);
        await mediator.Send(command);
        return Ok();
    }

    [HttpPost("{id}/families", Name = "GetFamilies")]
    [ProducesResponseType(200)]
    public async Task<List<FamilyDto>> GetFamilies(int id, [FromBody] GetFamiliesRequest payload)
    {
        var command = new GetFamiliesQuery()
        {
            ShareholderIds = payload.ShareholderIds
        };
        return await mediator.Send(command);
    }

    [HttpPost("{id}/add-photo", Name = "AddShareholderPhoto")]
    [ProducesResponseType(200)]
    public async Task<DocumentMetadataDto> AddShareholderPhoto(int id, [FromForm] UploadDocumentDto document)
    {
        var command = new AddShareholderPhotoCommand(id, document.File);
        var doc = await mediator.Send(command);

        return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
    }

    [HttpPost("{id}/add-signature", Name = "AddShareholderSignature")]
    [ProducesResponseType(200)]
    public async Task<DocumentMetadataDto> AddShareholderSignature(int id, [FromForm] UploadDocumentDto document)
    {
        var command = new AddShareholderSignatureCommand(id, document.File);
        var doc = await mediator.Send(command);

        return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
    }

    [HttpPost("{shareholderId}/upload-shareholder-document/{documentType}", Name = "UploadShareholderDocument")]
    [ProducesResponseType(200)]
    public async Task<DocumentMetadataDto> UploadShareholderDocument(int shareholderId, DocumentType documentType, [FromForm] UploadDocumentDto document)
    {
        var command = new AddShareholderDocumentCommand(shareholderId, documentType, document.File);
        var doc = await mediator.Send(command);

        return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
    }

    [HttpGet("counts", Name = "GetShareholderCountPerApprovalStatus")]
    [ProducesResponseType(200)]
    public async Task<ShareholderCountsByStatus> GetShareholderCountPerApprovalStatus()
    {
        return await mediator.Send(new GetShareholderCountPerApprovalStatusQuery());
    }

    [HttpPost("submit-for-approval", Name = "SubmitForApproval")]
    [ProducesResponseType(200)]

    public async Task<ActionResult> SubmitForApproval([FromBody] ChangeWorkflowStatusEntityDto payload)
    {
        await mediator.Send(new SubmitShareholderApprovalRequestCommand(payload.Id, payload.Note));
        return Ok();
    }

    [HttpPost("approve-approval-request", Name = "ApproveShareholder")]
    [ProducesResponseType(200)]

    public async Task<ActionResult> ApproveShareholder([FromBody] ChangeWorkflowStatusEntityDto payload)
    {
        await mediator.Send(new ApproveShareholderCommand(payload.Id, payload.Note));
        return Ok();
    }

    [HttpPost("reject-approval-request", Name = "RejectShareholderApprovalRequest")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> RejectShareholderApprovalRequest([FromBody] ChangeWorkflowStatusEntityDto payload)
    {
        await mediator.Send(new RejectShareholderApprovalRequestCommand(payload.Id, payload.Note));
        return Ok();
    }

    [HttpPost("{id}/note", Name = "AddShareholderNote")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> AddShareholderNote(int id, [FromBody] Note payload)
    {
        await mediator.Send(new AddShareholderCommentCommand(id, Domain.CommentType.Note, payload.Text));
        return Ok();
    }

    [HttpGet("{id}/record-versions", Name = "GetShareholderRecordVersions")]
    [ProducesResponseType(200)]
    public async Task<ShareholderRecordVersions> GetShareholderRecordVersions(int id)
    {
        return await mediator.Send(new GetShareholderRecordVersionsQuery(Id: id));
    }

    [HttpPost("block", Name = "BlockShareholder")]
    [ProducesResponseType(200)]
    public Task BlockShareholder([FromBody] BlockShareholderCommand payload)
    {
        return mediator.Send(payload);
    }

    [HttpPost("unblock", Name = "UnBlockShareholder")]
    [ProducesResponseType(200)]
    public Task UnBlockShareholder([FromBody] UnBlockShareholderCommand payload)
    {
        return mediator.Send(payload);
    }


    [HttpPost("save-shareholder-representative", Name = "SaveShareholderRepresentative")]
    [ProducesResponseType(200)]
    public Task SaveShareholderRepresentative([FromBody] SaveShareholderRepresentativeCommand data)
    {
        return mediator.Send(data);
    }


    [HttpGet("block-detail/{id}/{versionNumber?}", Name = "GetShareholderBlockDetail")]
    [ProducesResponseType(200)]
    public Task<ShareholderBlockDetail?> GetShareholderBlockDetail(int id, Guid? versionNumber)
    {
        return mediator.Send(new GetShareholderBlockDetailCommand(id, versionNumber));
    }

    [HttpPost("block-detail/{id}/document", Name = "UploadShareholderBlockDocument")]
    [ProducesResponseType(200)]
    public async Task<ActionResult> UploadShareholderBlockDocument(int id, [FromForm] UploadBlockDocumentDto document)
    {
        var command = new AddBlockShareholderAttachmentCommand(id, document.File);
        await mediator.Send(command);

        return Ok();
    }

    [HttpGet("{shareholderId}/change-logs", Name = "GetShareholderChangeLog")]
    [ProducesResponseType(200)]
    public Task<List<ShareholderChangeLogDto>> GetShareholderChangeLog(int shareholderId)
    {
        return mediator.Send(new GetShareholderChangeLogCommand(shareholderId));
    }
}