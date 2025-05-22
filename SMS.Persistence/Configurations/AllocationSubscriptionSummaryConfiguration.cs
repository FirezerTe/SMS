using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    public class AllocationSubscriptionSummaryConfiguration
        : IEntityTypeConfiguration<AllocationSubscriptionSummary>
    {
        public void Configure(EntityTypeBuilder<AllocationSubscriptionSummary> builder)
        {
            builder.HasKey(x => x.Id);

            builder.ToTable(x => x.IsTemporal(t =>
            {
                t.HasPeriodStart("PeriodStart");
                t.HasPeriodEnd("PeriodEnd");
            }));

            // builder.Property(x => x.LastSubscriptionApprovalStatus).HasConversion<string>();
            // builder.Property(x => x.LastPaymentApprovalStatus).HasConversion<string>();

            builder.HasOne(x => x.Allocation)
                .WithOne(x => x.SubscriptionSummary).
                HasForeignKey<AllocationSubscriptionSummary>(x => x.AllocationId);
        }
    }
}
