using MediatR;
using SMS.Domain;

namespace SMS.Application;

public record AddShareholderCommentCommand(int Id, CommentType CommentType, string Text) : IRequest;

internal class AddShareholderCommentCommandHandler : IRequestHandler<AddShareholderCommentCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;

    public AddShareholderCommentCommandHandler(IDataService dataService, IUserService userService)
    {
        this.dataService = dataService;
        this.userService = userService;
    }
    public async Task Handle(AddShareholderCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = new ShareholderComment
        {
            CommentType = request.CommentType.ToString(),
            Text = request.Text,
            Date = DateTime.Now,
            CommentedByUserId = userService.GetCurrentUserId(),
            CommentedBy = userService.GetCurrentUserFullName(),
            ShareholderId = request.Id
        };
        dataService.ShareholderComments.Add(comment);

        await dataService.SaveAsync(cancellationToken);
    }
}
