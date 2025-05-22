using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence;

public class TransferDividendTermConfiguration : IEntityTypeConfiguration<TransferDividendTerm>
{
    public void Configure(EntityTypeBuilder<TransferDividendTerm> builder)
    {
        builder.HasKey(x => x.Value);
        builder.Property(x => x.Value)
          .HasConversion<string>();
    }
}
