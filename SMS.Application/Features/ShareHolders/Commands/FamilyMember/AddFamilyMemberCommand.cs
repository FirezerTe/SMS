using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Security;
using SMS.Domain;

namespace SMS.Application;

[Authorize(Policy = AuthPolicy.CanCreateOrUpdateShareholderInfo)]
public record AddFamilyMembersCommand(List<int> Members, int? FamilyId) : IRequest<FamilyDto>;

internal class AddFamilyMembersCommandHandler : IRequestHandler<AddFamilyMembersCommand, FamilyDto>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public AddFamilyMembersCommandHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }

    public async Task<FamilyDto> Handle(AddFamilyMembersCommand request, CancellationToken cancellationToken)
    {
        var isNew = false;
        var family = await dataService.Families
            .Include(f => f.Members)
            .Where(f => f.Id == request.FamilyId)
            .FirstOrDefaultAsync();

        if (family == null)
        {
            family = new Family() { Members = new List<Shareholder>() };
            dataService.Families.Add(family);
        }

        var newMembers = request.Members.Where(memberId => !family.Members.Any(m => m.Id == memberId));
        var shareholders = dataService.Shareholders.Where(s => newMembers.Contains(s.Id));

        if (string.IsNullOrEmpty(family.Name))
        {
            //get the oldest shareholder???
            family.Name = shareholders.FirstOrDefault().DisplayName;
        }


        foreach (var shareholder in shareholders)
            family.Members.Add(shareholder);

        await dataService.SaveAsync(cancellationToken);

        return mapper.Map<FamilyDto>(family);

    }
}
