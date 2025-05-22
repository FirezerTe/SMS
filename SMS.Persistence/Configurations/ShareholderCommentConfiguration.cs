using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    internal class ShareholderCommentConfiguration : IEntityTypeConfiguration<ShareholderComment>
    {
        public void Configure(EntityTypeBuilder<ShareholderComment> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .HasOne(x => x.Shareholder)
                .WithMany(x => x.ShareholderComments)
                .HasForeignKey(x => x.ShareholderId);
        }
    }
}
