using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    internal class AddressConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.HouseNumber).IsRequired();

            builder.HasOne(a => a.Shareholder)
                .WithMany(sh => sh.Addresses)
                .HasForeignKey(a => a.ShareholderId);

            builder.HasOne(a => a.Country)
                .WithMany()
                .HasForeignKey(a => a.CountryId);
        }
    }

}
