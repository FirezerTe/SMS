using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    public class ShareholderTypeConfiguration : IEntityTypeConfiguration<ShareholderType>
    {
        public void Configure(EntityTypeBuilder<ShareholderType> builder)
        {
            builder.HasKey(x => x.Value);
            builder.Property(x => x.Value)
              .HasConversion<string>();
        }
    }
}
