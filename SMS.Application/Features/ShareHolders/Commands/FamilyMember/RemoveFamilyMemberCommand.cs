using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record RemoveFamilyMemberCommand(int ShareholderId, int FamilyId) : IRequest;

internal class RemoveFamilyMemberCommandHandler : IRequestHandler<RemoveFamilyMemberCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;

    public RemoveFamilyMemberCommandHandler(IDataService dataService, IUserService userService)
    {
        this.dataService = dataService;
        this.userService = userService;
    }

    public async Task Handle(RemoveFamilyMemberCommand request, CancellationToken cancellationToken)
    {
        var isNew = false;
        var shareholderFamily = await dataService.ShareholderFamilies
            .Where(shf => shf.ShareholderId == request.ShareholderId && shf.FamilyId == request.FamilyId)
            .FirstOrDefaultAsync();

        if (shareholderFamily != null)
        {
            dataService.ShareholderFamilies.Remove(shareholderFamily);
            await dataService.SaveAsync(cancellationToken);
        }
    }
}
