
using SMS.Domain.Lookups;

namespace SMS.Persistence.SeedData
{
    public static class DistrictSeedData
    {
        public static async Task SeedAsync(SMSDbContext dbContext)
        {
            if (!dbContext.Districts.Any())
            {
                await dbContext.Districts.AddRangeAsync(Districts);
            }
        }
        private static List<District> Districts => new List<District>()
        {
             new District () {DistrictName="HEAD OFFICE",DistrictCode="999"},
             new District () {DistrictName="NORTH ADDIS DISTRICT",DistrictCode="996"},
             new District () {DistrictName="WEST AA DISTRICT",DistrictCode="994"},
             new District () {DistrictName="EAST AA DISTRICT",DistrictCode="995"},
             new District () {DistrictName="SOUTH ADDIS DISTRICT",DistrictCode="990"},
             new District () {DistrictName="NORTH DISTRICT",DistrictCode="991"},
             new District () {DistrictName="SOUTH DISTRICT",DistrictCode="992"},
             new District () {DistrictName="EAST DISTRICT",DistrictCode="993"},

        };

    }
}
