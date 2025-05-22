using SMS.Domain;

namespace SMS.Persistence.SeedData;

public static class DividendPeriodSeedData
{
    public static async Task SeedAsync(SMSDbContext dbContext)
    {
        if (!dbContext.DividendPeriods.Any())
        {
            await dbContext.DividendPeriods.AddRangeAsync(Periods);
        }
    }
    private static List<DividendPeriod> Periods => new List<DividendPeriod>()
    {
        new DividendPeriod() { StartDate = new DateOnly(2010, 7, 1), EndDate = new DateOnly(2011, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2011, 7, 1), EndDate = new DateOnly(2012, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2012, 7, 1), EndDate = new DateOnly(2013, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2013, 7, 1), EndDate = new DateOnly(2014, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2014, 7, 1), EndDate = new DateOnly(2015, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2015, 7, 1), EndDate = new DateOnly(2016, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2016, 7, 1), EndDate = new DateOnly(2017, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2017, 7, 1), EndDate = new DateOnly(2018, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2018, 7, 1), EndDate = new DateOnly(2019, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2019, 7, 1), EndDate = new DateOnly(2020, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2020, 7, 1), EndDate = new DateOnly(2021, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2021, 7, 1), EndDate = new DateOnly(2022, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2022, 7, 1), EndDate = new DateOnly(2023, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2023, 7, 1), EndDate = new DateOnly(2024, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2024, 7, 1), EndDate = new DateOnly(2025, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2025, 7, 1), EndDate = new DateOnly(2026, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2026, 7, 1), EndDate = new DateOnly(2027, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2027, 7, 1), EndDate = new DateOnly(2028, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2028, 7, 1), EndDate = new DateOnly(2029, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2029, 7, 1), EndDate = new DateOnly(2030, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2030, 7, 1), EndDate = new DateOnly(2031, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2031, 7, 1), EndDate = new DateOnly(2032, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2032, 7, 1), EndDate = new DateOnly(2033, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2033, 7, 1), EndDate = new DateOnly(2034, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2034, 7, 1), EndDate = new DateOnly(2035, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2035, 7, 1), EndDate = new DateOnly(2036, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2036, 7, 1), EndDate = new DateOnly(2037, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2037, 7, 1), EndDate = new DateOnly(2038, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2038, 7, 1), EndDate = new DateOnly(2039, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2039, 7, 1), EndDate = new DateOnly(2040, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2040, 7, 1), EndDate = new DateOnly(2041, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2041, 7, 1), EndDate = new DateOnly(2042, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2042, 7, 1), EndDate = new DateOnly(2043, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2043, 7, 1), EndDate = new DateOnly(2044, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2044, 7, 1), EndDate = new DateOnly(2045, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2045, 7, 1), EndDate = new DateOnly(2046, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2046, 7, 1), EndDate = new DateOnly(2047, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2047, 7, 1), EndDate = new DateOnly(2048, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2048, 7, 1), EndDate = new DateOnly(2049, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2049, 7, 1), EndDate = new DateOnly(2050, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2050, 7, 1), EndDate = new DateOnly(2051, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2051, 7, 1), EndDate = new DateOnly(2052, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2052, 7, 1), EndDate = new DateOnly(2053, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2053, 7, 1), EndDate = new DateOnly(2054, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2054, 7, 1), EndDate = new DateOnly(2055, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2055, 7, 1), EndDate = new DateOnly(2056, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2056, 7, 1), EndDate = new DateOnly(2057, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2057, 7, 1), EndDate = new DateOnly(2058, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2058, 7, 1), EndDate = new DateOnly(2059, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2059, 7, 1), EndDate = new DateOnly(2060, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2060, 7, 1), EndDate = new DateOnly(2061, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2061, 7, 1), EndDate = new DateOnly(2062, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2062, 7, 1), EndDate = new DateOnly(2063, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2063, 7, 1), EndDate = new DateOnly(2064, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2064, 7, 1), EndDate = new DateOnly(2065, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2065, 7, 1), EndDate = new DateOnly(2066, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2066, 7, 1), EndDate = new DateOnly(2067, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2067, 7, 1), EndDate = new DateOnly(2068, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2068, 7, 1), EndDate = new DateOnly(2069, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2069, 7, 1), EndDate = new DateOnly(2070, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2070, 7, 1), EndDate = new DateOnly(2071, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2071, 7, 1), EndDate = new DateOnly(2072, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2072, 7, 1), EndDate = new DateOnly(2073, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2073, 7, 1), EndDate = new DateOnly(2074, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2074, 7, 1), EndDate = new DateOnly(2075, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2075, 7, 1), EndDate = new DateOnly(2076, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2076, 7, 1), EndDate = new DateOnly(2077, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2077, 7, 1), EndDate = new DateOnly(2078, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2078, 7, 1), EndDate = new DateOnly(2079, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2079, 7, 1), EndDate = new DateOnly(2080, 6, 30) },
        new DividendPeriod() { StartDate = new DateOnly(2080, 7, 1), EndDate = new DateOnly(2081, 6, 30) }
    };
}
