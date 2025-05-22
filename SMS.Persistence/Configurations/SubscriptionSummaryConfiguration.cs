using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations;

public class SubscriptionSummaryConfiguration : IEntityTypeConfiguration<SubscriptionPaymentSummary>
{
    public void Configure(EntityTypeBuilder<SubscriptionPaymentSummary> builder)
    {
        builder.HasKey(x => x.Id);

        builder.ToTable(x => x.IsTemporal(t =>
        {
            t.HasPeriodStart("PeriodStart");
            t.HasPeriodEnd("PeriodEnd");
        }));

        builder.HasOne(x => x.Subscription)
            .WithOne(x => x.SubscriptionSummary).
            HasForeignKey<SubscriptionPaymentSummary>(x => x.SubscriptionId);
    }
}
