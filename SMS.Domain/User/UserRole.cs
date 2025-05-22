using Microsoft.AspNetCore.Identity;
using SMS.Domain.User;

namespace SMS.Domain;

public class UserRole : IdentityUserRole<string>
{
    public virtual SMSRole Role { get; set; }
    public virtual SMSUser User { get; set; }
}
