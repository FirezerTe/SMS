using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    internal class ParValueConfiguration : WorkflowEnabledEntityConfiguration<ParValue>
    {
        public override void Configure(EntityTypeBuilder<ParValue> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.Name).IsRequired(true);
            builder.HasIndex(x => x.ApprovalStatus).IsUnique();
            builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
        }
    }
}
