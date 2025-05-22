using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    internal class PaymentConfiguration : WorkflowEnabledEntityConfiguration<Payment>
    {
        public override void Configure(EntityTypeBuilder<Payment> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.Amount).IsRequired(true);
            builder.Property(x => x.EffectiveDate).IsRequired(true);

            builder.Property(x => x.PaymentTypeEnum)
            .IsRequired()
            .HasConversion<string>();

            builder.Property(x => x.PaymentMethodEnum)
            .IsRequired()
            .HasConversion<string>();

            builder.HasOne(x => x.Subscription)
                .WithMany(x => x.Payments)
                .HasForeignKey(x => x.SubscriptionId);

            builder.HasOne(x => x.PaymentType)
                .WithMany()
                .HasForeignKey(x => x.PaymentTypeEnum);

            builder.HasOne(x => x.PaymentMethod)
                   .WithMany()
                   .HasForeignKey(x => x.PaymentMethodEnum);

            builder.HasOne(x => x.District)
               .WithMany()
               .HasForeignKey(x => x.DistrictId);

            builder.HasOne(x => x.Branch)
                .WithMany()
                .HasForeignKey(x => x.BranchId);

            builder.HasMany(x => x.Receipts)
                .WithOne()
                .HasForeignKey(x => x.PaymentId);

            builder.HasOne(p => p.ParentPayment)
            .WithMany()
            .HasForeignKey(p => p.ParentPaymentId);

            builder.HasOne(p => p.ForeignCurrency)
            .WithMany()
            .HasForeignKey(p => p.ForeignCurrencyId);

            builder.HasMany(p => p.Shares)
            .WithOne(s => s.Payment)
            .HasForeignKey(p => p.PaymentId);
        }
    }
}
