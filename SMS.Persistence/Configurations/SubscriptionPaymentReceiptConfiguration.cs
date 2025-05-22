using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    public class SubscriptionPaymentReceiptConfiguration : IEntityTypeConfiguration<SubscriptionPaymentReceipt>
    {
        public void Configure(EntityTypeBuilder<SubscriptionPaymentReceipt> builder)
        {
            builder.HasKey(x => x.Id);
            
        }
    }
}
