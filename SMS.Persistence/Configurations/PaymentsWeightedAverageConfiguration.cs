using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    internal class PaymentsWeightedAverageConfiguration : IEntityTypeConfiguration<PaymentsWeightedAverage>
    {
        public void Configure(EntityTypeBuilder<PaymentsWeightedAverage> builder)
        {

            builder.HasOne(x => x.Payment)
                        .WithMany(x => x.PaymentsWeightedAverages)
                        .HasForeignKey(x => x.PaymentId);

            builder.HasIndex(x => new { x.PaymentId, x.DividendSetupId }).IsUnique();
        }
    }
}
