using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    public class ShareholderStatusConfiguration : IEntityTypeConfiguration<ShareholderStatus>
    {
        public void Configure(EntityTypeBuilder<ShareholderStatus> builder)
        {
            builder.HasKey(x => x.Value);
            builder.Property(x => x.Value)
              .HasConversion<string>();
        }
    }
}
