using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;
using SMS.Domain.Enums;
using System.Text.Json;

namespace SMS.Persistence.Configurations;

public class ShareholderConfiguration : WorkflowEnabledEntityConfiguration<Shareholder>
{
    public override void Configure(EntityTypeBuilder<Shareholder> builder)
    {
        base.Configure(builder);
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Gender).HasConversion<string>();
        builder.Property(x => x.MiddleName).IsRequired(false);
        builder.Property(x => x.LastName).IsRequired(false);
        builder.Property(x => x.IsNew).IsRequired().HasDefaultValue(true);
        //builder.Property(x => x.HasActiveTransfer).IsRequired().HasDefaultValue(false);
        builder.Property(x => x.IsBlocked).IsRequired().HasDefaultValue(false);
        builder.Property(x => x.ShareholderType).HasConversion<string>();

        builder.Property(x => x.ShareholderNumber)
               .IsRequired(true)
               .HasDefaultValueSql("NEXT VALUE FOR ShareholderNumber");

        builder.HasIndex(x => x.ShareholderNumber).IsUnique(true).IsClustered(false);

        builder.Property(x => x.ShareholderStatus)
            .IsRequired()
            .HasConversion<string>()
            .HasDefaultValue(ShareholderStatusEnum.Active);

        builder.Property(x => x.RepresentativeAddress).HasConversion(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
            v => JsonSerializer.Deserialize<RepresentativeAddress>(v, (JsonSerializerOptions)null));

        builder.HasOne(x => x.Status)
            .WithMany()
            .HasForeignKey(x => x.ShareholderStatus);

        builder.HasOne(x => x.Type)
            .WithMany()
            .HasForeignKey(x => x.ShareholderType);

        builder.Property(x => x.AmharicMiddleName).HasDefaultValue("");
        builder.Property(x => x.AmharicLastName).HasDefaultValue("");
        builder.Property(x => x.MiddleName).HasDefaultValue("");
        builder.Property(x => x.LastName).HasDefaultValue("");

        builder.Property(x => x.DisplayName)
            .HasComputedColumnSql("TRIM(CONCAT_WS(' ',[Name],[MiddleName],[Lastname]))");
        builder.Property(x => x.AmharicDisplayName)
            .HasComputedColumnSql("TRIM(CONCAT_WS(' ',[AmharicName],[AmharicMiddleName],[AmharicLastname]))");

        builder.HasMany(x => x.Contacts).WithOne(x => x.Shareholder).HasForeignKey(x => x.ShareholderId);
        builder.HasMany(x => x.Families)
            .WithMany(x => x.Members)
            .UsingEntity<ShareholderFamily>();
        builder.HasMany(x => x.Certficates).WithOne(x => x.Shareholder).HasForeignKey(x => x.ShareholderId);
    }
}
