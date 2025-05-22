using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    public class TransferDocumentConfiguration : IEntityTypeConfiguration<TransferDocument>
    {
        public void Configure(EntityTypeBuilder<TransferDocument> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.DocumentType).HasConversion<string>();
        }
    }
}
