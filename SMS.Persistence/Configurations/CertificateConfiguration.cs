using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    public class CertificateConfiguration : IEntityTypeConfiguration<Certficate>
    {
        public void Configure(EntityTypeBuilder<Certficate> builder)
        {
            builder.HasOne(x => x.CertficateType)
               .WithMany()
               .HasForeignKey(x => x.CertificateIssuanceTypeEnum);

            builder.HasOne(x => x.PaymentMethod)
                .WithMany()
                .HasForeignKey(x => x.PaymentMethodEnum);
            builder.OwnsMany(x => x.Attachments, attachments =>
            {
                attachments.ToJson();
                attachments.HasIndex(x => x.DocumentId);
            });
        }
    }
}