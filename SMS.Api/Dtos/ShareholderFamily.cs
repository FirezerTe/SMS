namespace SMS.Api.Dtos;

public record AddFamilyMembersRequest(int? FamilyId, List<int> Members);
public record RemoveFamilyMembersRequest(int FamilyId, int ShareholderId);
public record GetFamiliesRequest(List<int> ShareholderIds);
