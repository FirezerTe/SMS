using SMS.Common;

namespace SMS.BackgroundJob.Processor;

public class UserService : IUserService
{
    public string GetCurrentUserId() => "SYSTEM";

    public string GetCurrentUserFullName() => "SYSTEM";
}