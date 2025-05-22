using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain.Common;

namespace SMS.Persistence.Configurations
{
    public abstract class AuditableSoftDeleteEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : AuditableSoftDeleteEntity
    {
        public void Configure(EntityTypeBuilder<T> builder)
        {
            builder.Property(x => x.IsDeleted).HasDefaultValue(false);
            builder.HasQueryFilter(x => x.IsDeleted != true);
            ConfigureDerivedProperties(builder);

        }

        public abstract void ConfigureDerivedProperties(EntityTypeBuilder<T> builder);

    }
}
