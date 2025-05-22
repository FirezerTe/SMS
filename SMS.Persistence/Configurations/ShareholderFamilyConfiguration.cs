using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence.Configurations
{
    public class ShareholderFamilyConfiguration : AuditableSoftDeleteEntityConfiguration<ShareholderFamily>
    {
        public override void ConfigureDerivedProperties(EntityTypeBuilder<ShareholderFamily> builder)
        {
            builder.HasKey(e => e.Id);
        }
    }
}

