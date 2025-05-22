using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    public class CertificateTypeConfiguration : IEntityTypeConfiguration<CertficateType>
    {
        public void Configure(EntityTypeBuilder<CertficateType> builder)
        {
            builder.HasKey(x => x.Value);
            builder.Property(x => x.Value).HasConversion<string>();

        }
    }
}