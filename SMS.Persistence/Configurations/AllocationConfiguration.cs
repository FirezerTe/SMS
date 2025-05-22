using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.Configurations
{
    public class AllocationConfiguration : WorkflowEnabledEntityConfiguration<Allocation>
    {
        public override void Configure(EntityTypeBuilder<Allocation> builder)
        {
            base.Configure(builder);

            builder.Property(x => x.Amount)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(x => x.AllocationType).
                HasConversion<string>().IsRequired().HasDefaultValue(AllocationType.Bank);

            builder.HasIndex(x => x.IsDividendAllocation).IsUnique().HasFilter("IsDividendAllocation = 1");
        }
    }
}
