using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence;

public class TransferTypeConfiguration : IEntityTypeConfiguration<TransferType>
{
    public void Configure(EntityTypeBuilder<TransferType> builder)
    {
        builder.HasKey(x => x.Value);
        builder.Property(x => x.Value).HasConversion<string>();
    }
}
