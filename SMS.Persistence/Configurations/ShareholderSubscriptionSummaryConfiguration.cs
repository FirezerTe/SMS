using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence;

public class ShareholderSubscriptionSummaryConfiguration : IEntityTypeConfiguration<ShareholderSubscriptionSummary>
{
    public void Configure(EntityTypeBuilder<ShareholderSubscriptionSummary> builder)
    {
        builder.HasKey(x => x.Id);



        builder.ToTable(x => x.IsTemporal(t =>
        {
            t.HasPeriodStart("PeriodStart");
            t.HasPeriodEnd("PeriodEnd");
        }));

        builder.Property(p => p.PendingApprovalPaymentsAmount).HasDefaultValue(0);
        builder.Property(p => p.ApprovedPaymentsAmount).HasDefaultValue(0);
        builder.Property(p => p.PendingApprovalSubscriptionAmount).HasDefaultValue(0);
        builder.Property(p => p.ApprovedSubscriptionAmount).HasDefaultValue(0);
    }
}
