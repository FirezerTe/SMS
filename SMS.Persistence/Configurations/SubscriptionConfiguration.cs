using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.Configurations;

internal class SubscriptionConfiguration : WorkflowEnabledEntityConfiguration<Subscription>
{
    public override void Configure(EntityTypeBuilder<Subscription> builder)
    {
        base.Configure(builder);
        builder.Property(x => x.Amount).IsRequired(true);
        builder.Property(x => x.SubscriptionDate).IsRequired(true);
        builder.Property(x => x.SubscriptionType).HasConversion<string>().IsRequired(true).HasDefaultValue(SubscriptionTypeEnum.New);
        // builder.Property(x => x.TransferId).IsRequired(false);

        builder.HasOne(x => x.Shareholder)
            .WithMany(x => x.Subscriptions)
            .HasForeignKey(x => x.ShareholderId);

        builder.HasOne(x => x.SubscriptionGroup)
           .WithMany(x => x.Subscriptions)
           .HasForeignKey(x => x.SubscriptionGroupID);

        builder.HasOne(x => x.District)
           .WithMany()
           .HasForeignKey(x => x.SubscriptionDistrictID);

        builder.HasOne(x => x.Branch)
            .WithMany()
            .HasForeignKey(x => x.SubscriptionBranchID);

        builder.HasOne(x => x.Type)
            .WithMany()
            .HasForeignKey(x => x.SubscriptionType);

        // builder.HasOne(x => x.Transfer)
        //     .WithMany(x => x.Subscriptions)
        //     .OnDelete(DeleteBehavior.NoAction)
        //     .HasForeignKey(x => x.TransferId);


    }
}
