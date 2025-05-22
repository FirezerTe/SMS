using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain.User;

namespace SMS.Persistence.Configurations;

public class SMSRoleConfiguration : IEntityTypeConfiguration<SMSRole>
{
    public void Configure(EntityTypeBuilder<SMSRole> builder)
    {
        // builder.HasKey(b => b.Id);
        // builder.HasMany(r => r.Claims).WithOne().HasForeignKey(r => r.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);
    }
}
