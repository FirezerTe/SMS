using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;
using SMS.Persistence.Configurations;

namespace SMS.Persistence;

public class DividendDecisionConfiguration : WorkflowEnabledEntityConfiguration<DividendDecision>
{
    public override void Configure(EntityTypeBuilder<DividendDecision> builder)
    {
        base.Configure(builder);
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Decision).HasConversion<string>();
        builder.Property(x => x.DecisionProcessed).HasDefaultValue(false);
        builder.Property(x => x.DecisionDate).IsRequired(false);

        builder.Property(x => x.NetPay)
           .HasComputedColumnSql("CASE WHEN WithdrawnAmount - Tax > 0 THEN WithdrawnAmount - Tax ELSE 0 END");

        builder.HasOne(x => x.Dividend)
            .WithOne(x => x.DividendDecision).
            HasForeignKey<DividendDecision>(x => x.DividendId);
    }
}

