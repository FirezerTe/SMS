using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record GetShareholderCountPerApprovalStatusQuery() : IRequest<ShareholderCountsByStatus>;
public record ShareholderCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

public class GetShareholderCountPerApprovalStatusQueryHandler : IRequestHandler<GetShareholderCountPerApprovalStatusQuery, ShareholderCountsByStatus>
{
    private readonly IDataService dataService;

    public GetShareholderCountPerApprovalStatusQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<ShareholderCountsByStatus> Handle(GetShareholderCountPerApprovalStatusQuery request, CancellationToken cancellationToken)
    {
        var approved = await dataService.ApprovedShareholders.CountAsync();
        var approvalRequests = await dataService.ShareholderApprovalRequests.CountAsync();
        var rejected = await dataService.RejectedShareholderApprovalRequests.CountAsync();
        var draft = await dataService.DraftShareholders.CountAsync();

        return new(approved, approvalRequests, rejected, draft);
    }
}
