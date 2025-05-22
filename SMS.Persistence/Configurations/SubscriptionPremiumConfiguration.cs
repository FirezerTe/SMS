using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence;

public class SubscriptionPremiumConfiguration : IEntityTypeConfiguration<SubscriptionPremium>
{
    public void Configure(EntityTypeBuilder<SubscriptionPremium> builder)
    {
        builder.HasKey(x => x.Id);
        builder.OwnsMany(x => x.Ranges, rangeBuilder =>
        {
            rangeBuilder.ToJson();
            rangeBuilder.Property(x => x.UpperBound).IsRequired(false);
        });
    }
}
