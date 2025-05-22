namespace SMS.Common.Services.RigsWeb
{
    public interface IRigsWebService
    {
        Task<List<RigsTransaction>> GetAccountHistory(string AccountNumber, string StartDate, string EndDate);
        Task<RigsTransaction> GetAccountInfo(string AccountNumber);
        Task<RigsResponseDto> PostTransaction(List<EndOfDayDto> transactionListResponses, string batch, DateOnly date, string type);
        Task<bool> IsWebServiceRunning();

    }
}
