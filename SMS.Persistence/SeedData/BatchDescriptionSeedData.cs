using SMS.Domain.BatchReferenceDescription;

namespace SMS.Persistence.SeedData
{
    public static class BatchDescriptionSeedData
    {
        public static async Task SeedAsync(SMSDbContext dbContext)
        {
            if (!dbContext.BatchReferenceDescriptions.Any())
            {
                await dbContext.BatchReferenceDescriptions.AddRangeAsync(Batches);
            }
        }
        private static List<BatchReferenceDescription> Batches => new List<BatchReferenceDescription>()
        {
             new BatchReferenceDescription () {Value=Domain.Enums.BatchDescriptionEnum.SMS_EOD_Post,Description="SMS/EOD/Post/"},
             new BatchReferenceDescription () {Value=Domain.Enums.BatchDescriptionEnum.SMS_Div_DEC,Description="SMS/Div/DEC/SH"},
             new BatchReferenceDescription () {Value=Domain.Enums.BatchDescriptionEnum.SMS_Div_Uncollected,Description="SMS/Div/Pend/"},
         };
    }
}