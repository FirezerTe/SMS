using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations;

internal class TransferConfiguration : WorkflowEnabledEntityConfiguration<Transfer>
{
    public override void Configure(EntityTypeBuilder<Transfer> builder)
    {
        base.Configure(builder);
        builder.Property(x => x.FromShareholderId).IsRequired(true);
        builder.Property(x => x.TransferType).HasConversion<string>();
        builder.Property(x => x.DividendTerm).HasConversion<string>();

        builder.OwnsMany(x => x.Transferees, transferees =>
        {
            transferees.ToJson();
            transferees.HasIndex(t => t.ShareholderId).IsClustered();
            transferees.OwnsMany(t => t.Payments, payments =>
            {
                payments.HasIndex(p => p.PaymentId).IsClustered();
            });
        });
    }
}
