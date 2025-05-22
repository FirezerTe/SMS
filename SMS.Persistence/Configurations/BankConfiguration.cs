using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain.Bank;

namespace SMS.Persistence.Configurations
{
    internal class BankConfiguration : WorkflowEnabledEntityConfiguration<Bank>
    {
        public override void Configure(EntityTypeBuilder<Bank> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.Name).IsRequired(true);
            builder.HasIndex(x => x.ApprovalStatus).IsUnique();
            builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
        }
    }
}
