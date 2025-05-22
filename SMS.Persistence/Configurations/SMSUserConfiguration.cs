using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain.User;

namespace SMS.Persistence.Configurations;

public class SMSUserConfiguration : IEntityTypeConfiguration<SMSUser>
{
    public void Configure(EntityTypeBuilder<SMSUser> builder)
    {
        builder.HasMany(p => p.Roles).WithOne().HasForeignKey(p => p.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(u => u.Branch).WithMany().HasForeignKey(u => u.BranchId);
        builder.Property(u => u.IsDeactivated).HasDefaultValue(false);

    }
}
