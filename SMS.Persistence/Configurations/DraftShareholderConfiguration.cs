using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    internal class DraftShareholderConfiguration : IEntityTypeConfiguration<DraftShareholder>
    {
        public void Configure(EntityTypeBuilder<DraftShareholder> builder)
        {
            builder.HasNoKey().ToView("View_DraftShareholders");
            builder.Property(x => x.Gender).HasConversion<string>();
            builder.Property(x => x.ApprovalStatus).HasConversion<string>();
            builder.Property(x => x.ShareholderStatus).IsRequired().HasConversion<string>();
            builder.Property(x => x.ShareholderType).HasConversion<string>();
            builder.HasOne(x => x.Type)
                .WithMany()
                .HasForeignKey(x => x.ShareholderType);
        }
    }
}
