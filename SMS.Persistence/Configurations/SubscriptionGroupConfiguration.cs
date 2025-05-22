using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations;

public class SubscriptionGroupConfiguration : IEntityTypeConfiguration<SubscriptionGroup>
{
    public void Configure(EntityTypeBuilder<SubscriptionGroup> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.Allocation)
            .WithMany(x => x.SubscriptionGroups)
            .HasForeignKey(x => x.AllocationID);
        builder.Property(x => x.MinFirstPaymentAmountUnit).HasConversion<string>();
        builder.Ignore(x => x.IsActive);
        builder.HasOne(x => x.SubscriptionPremium)
            .WithMany()
            .HasForeignKey(x => x.SubscriptionPremiumId);
    }
}
