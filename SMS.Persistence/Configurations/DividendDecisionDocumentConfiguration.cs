using SMS.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SMS.Persistence;

public class DividendDecisionDocumentConfiguration : IEntityTypeConfiguration<DividendDecisionDocument>
{
    public void Configure(EntityTypeBuilder<DividendDecisionDocument> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.DocumentType).HasConversion<string>();
    }
}
