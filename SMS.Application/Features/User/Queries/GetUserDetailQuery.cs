using MediatR;
using SMS.Application.Security;

namespace SMS.Application.Features.User.Queries;

public record GetUserDetailQuery(string Id) : IRequest<UserDetail>;

public class GetUserDetailQueryHandler : IRequestHandler<GetUserDetailQuery, UserDetail>
{
    private readonly IUserRepository userRepository;

    public GetUserDetailQueryHandler(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }
    public async Task<UserDetail> Handle(GetUserDetailQuery request, CancellationToken cancellationToken)
    {
        return await userRepository.GetUserById(request.Id);
    }
}
