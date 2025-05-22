using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.Configurations;

public class WorkflowEnabledEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : WorkflowEnabledEntity
{
    public virtual void Configure(EntityTypeBuilder<T> builder)
    {

        /*
         ALTER TABLE [Shareholders] ALTER COLUMN PeriodStart DROP HIDDEN
        ALTER TABLE [Shareholders] ALTER COLUMN PeriodEnd DROP HIDDEN
        */
        builder.ToTable(x => x.IsTemporal(t =>
        {
            t.HasPeriodStart("PeriodStart");
            t.HasPeriodEnd("PeriodEnd");

            //t.UseHistoryTable("ShareholdersHistory");
        }));

        builder.Property(x => x.ApprovalStatus)
            .HasDefaultValue(ApprovalStatus.Draft)
            .HasConversion<string>();

        builder.Ignore(x => x.SkipStateTransitionCheck);

        builder.Property(x => x.VersionNumber).IsRequired();
        // builder.Ignore(x => x.IsSubmitted);
        // builder.Ignore(x => x.IsApproved);
        // builder.Ignore(x => x.IsDraft);
        // builder.Ignore(x => x.IsRejected);
    }
}
