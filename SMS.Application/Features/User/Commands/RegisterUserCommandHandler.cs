using MediatR;

namespace SMS.Application.Features.User
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand>
    {
        private readonly IUserRepository userRepository;

        public RegisterUserCommandHandler(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }
        Task IRequestHandler<RegisterUserCommand>.Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            return Task.FromResult(Unit.Value);
        }
    }
}
