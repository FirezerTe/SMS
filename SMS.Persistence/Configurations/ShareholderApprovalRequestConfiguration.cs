using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    internal class ShareholderApprovalRequestConfiguration : IEntityTypeConfiguration<ShareholderApprovalRequest>
    {
        public void Configure(EntityTypeBuilder<ShareholderApprovalRequest> builder)
        {
            builder.HasNoKey().ToView("View_ShareholderApprovalRequests");
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
