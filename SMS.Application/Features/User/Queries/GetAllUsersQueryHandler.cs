using MediatR;
using SMS.Application.Security;

namespace SMS.Application.Features.User.Queries;

public record GetAllUsersQuery() : IRequest<List<UserDetail>>;

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<UserDetail>>
{
    private readonly IUserRepository userRepository;

    public GetAllUsersQueryHandler(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }
    public async Task<List<UserDetail>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        return await userRepository.GetAllUsers();
    }
}
