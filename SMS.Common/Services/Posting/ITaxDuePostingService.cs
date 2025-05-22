namespace SMS.Common.Services.Posting
{
    public interface ITaxDuePostingService
    {
        Task<bool> TaxDueDateComputing(int setupId);
    }
}