using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence;

public class DividendConfiguration : IEntityTypeConfiguration<Dividend>
{
    public void Configure(EntityTypeBuilder<Dividend> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.ShareholderId).IsClustered(false);
        builder.HasIndex(x => x.DividendSetupId).IsClustered(false);

        builder.ToTable(x => x.IsTemporal(t =>
                                      {
                                          t.HasPeriodStart("PeriodStart");
                                          t.HasPeriodEnd("PeriodEnd");
                                      }));

        builder.Property(x => x.ApprovalStatus)
                               .HasDefaultValue(ApprovalStatus.Draft)
                               .HasConversion<string>();

        builder.HasOne(x => x.Shareholder).WithMany().HasForeignKey(x => x.ShareholderId);
        builder.HasOne(x => x.DividendSetup).WithMany().HasForeignKey(x => x.DividendSetupId);
    }
}
