using SMS.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SMS.Persistence;

public class SubscriptionDocumentConfiguration : IEntityTypeConfiguration<SubscriptionDocument>
{
    public void Configure(EntityTypeBuilder<SubscriptionDocument> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.DocumentType).HasConversion<string>();
    }
}
