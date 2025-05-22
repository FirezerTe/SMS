using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    internal class PaymentMethodConfigruation : IEntityTypeConfiguration<PaymentMethod>
    {
        public void Configure(EntityTypeBuilder<PaymentMethod> builder)
        {
            builder.HasKey(x => x.Value);
            builder.Property(x => x.Value)
              .HasConversion<string>();
        }
    }
}
