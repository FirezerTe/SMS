using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence;

public class ShareConfiguration : IEntityTypeConfiguration<Share>
{
    public void Configure(EntityTypeBuilder<Share> builder)
    {
        builder.HasKey(x => x.SerialNumber);
        builder.ToTable(x => x.IsTemporal(t =>
         {
             t.HasPeriodStart("PeriodStart");
             t.HasPeriodEnd("PeriodEnd");
         }));

        builder.Property(x => x.SerialNumber)
            .HasDefaultValueSql("NEXT VALUE FOR ShareSerialNumber");
        builder.Property(x => x.PaymentId).IsRequired(false);
        builder.HasIndex(x => x.PaymentId).IsClustered(false);
        builder.HasIndex(x => x.ParValue).IsClustered(false);
    }
}
