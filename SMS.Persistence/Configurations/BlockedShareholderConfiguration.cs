using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.Configurations;

internal class BlockedShareholderConfiguration : WorkflowEnabledEntityConfiguration<BlockedShareholder>
{
    public override void Configure(EntityTypeBuilder<BlockedShareholder> builder)
    {
        base.Configure(builder);
        builder.Property(x => x.Amount).IsRequired(false);
        builder.Property(x => x.Description).IsRequired(true);
        builder.Property(x => x.BlockedTill).IsRequired(false);
        builder.Property(x => x.IsActive).IsRequired(true).HasDefaultValue(true);
        builder.Property(x => x.Unit)
            .HasConversion<string>()
            .HasDefaultValue(ShareUnit.Birr).IsRequired(true);

        builder.HasOne(x => x.BlockType).WithMany().HasForeignKey(x => x.BlockTypeId);
        builder.HasOne(x => x.BlockReason).WithMany().HasForeignKey(x => x.BlockReasonId);

        builder.OwnsMany(x => x.Attachments, attachments =>
        {
            attachments.ToJson();
            attachments.HasIndex(x => x.DocumentId);
        });
    }
}
