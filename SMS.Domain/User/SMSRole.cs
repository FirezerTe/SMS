using Microsoft.AspNetCore.Identity;

namespace SMS.Domain.User
{
    public class SMSRole : IdentityRole<string>
    {
        public SMSRole() : base()
        {

        }
        public string Description { get; set; }
        public string DisplayName { get; set; }

        public virtual ICollection<IdentityRoleClaim<string>> Claims { get; set; }
        // public virtual ICollection<IdentityRoleClaim<string>> Claims { get; set; }
        // public virtual ICollection<IdentityRoleClaim<string>> Claims { get; set; }

        public SMSRole(string name, string displayName, string description) : base(name)
        {
            Id = Guid.NewGuid().ToString();
            Description = description;
            DisplayName = displayName;
        }
    }
}
