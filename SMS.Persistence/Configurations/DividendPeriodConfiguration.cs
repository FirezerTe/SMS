using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SMS.Domain;

namespace SMS.Persistence;

public class DividendPeriodConfiguration : IEntityTypeConfiguration<DividendPeriod>
{
    public void Configure(EntityTypeBuilder<DividendPeriod> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Year)
               .HasComputedColumnSql("CONCAT(YEAR(StartDate), '-', YEAR(EndDate))");
        builder.Property(x => x.DayCount)
               .HasComputedColumnSql("DATEDIFF(day,StartDate, EndDate) + 1");
    }
}

