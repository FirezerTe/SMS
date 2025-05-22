using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;
using SMS.Domain.Enums;


namespace SMS.Persistence;

public class DividendSetupConfiguration : IEntityTypeConfiguration<DividendSetup>
{
        public void Configure(EntityTypeBuilder<DividendSetup> builder)
        {
                builder.HasKey(x => x.Id);

                builder.ToTable(x => x.IsTemporal(t =>
                            {
                                    t.HasPeriodStart("PeriodStart");
                                    t.HasPeriodEnd("PeriodEnd");
                            }));

                builder.Property(x => x.IsTaxApplicable).HasComputedColumnSql("CAST(CASE WHEN DATEADD(DAY, 1, DividendTaxDueDate)  > GETDATE() THEN 0  ELSE 1 END AS BIT)");

                builder.Property(x => x.ApprovalStatus)
                       .HasDefaultValue(ApprovalStatus.Draft)
                       .HasConversion<string>();

                builder.Property(x => x.DistributionStatus)
                        .HasDefaultValue(DividendDistributionStatus.NotStarted)
                        .HasConversion<string>();

                builder.Property(x => x.DividendRateComputationStatus)
                        .HasDefaultValue(DividendRateComputationStatus.NotStarted)
                        .HasConversion<string>();

                builder.HasOne(x => x.DividendPeriod)
                     .WithOne(x => x.DividendSetup)
                     .HasForeignKey<DividendSetup>(x => x.DividendPeriodId);
        }
}
