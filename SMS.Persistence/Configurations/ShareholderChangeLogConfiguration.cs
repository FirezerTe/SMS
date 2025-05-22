using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations;

public class ShareholderChangeLogConfiguration : IEntityTypeConfiguration<ShareholderChangeLog>
{
    public void Configure(EntityTypeBuilder<ShareholderChangeLog> builder)
    {
        builder.HasKey(x => x.Id);

        builder.ToTable(x => x.IsTemporal(t =>
        {
            t.HasPeriodStart("PeriodStart");
            t.HasPeriodEnd("PeriodEnd");
        }));

        builder.Property(x => x.EntityType).HasConversion<string>();
        builder.Property(x => x.ChangeType).HasConversion<string>();
    }
}
