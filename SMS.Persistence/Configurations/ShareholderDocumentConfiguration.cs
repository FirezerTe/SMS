using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    internal class ShareholderDocumentConfiguration : AuditableSoftDeleteEntityConfiguration<ShareholderDocument>
    {
        public override void ConfigureDerivedProperties(EntityTypeBuilder<ShareholderDocument> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.DocumentType).HasConversion<string>();
        }
    }
}
