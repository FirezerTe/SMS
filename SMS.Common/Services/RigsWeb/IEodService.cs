namespace SMS.Common.Services.RigsWeb
{
    public interface IEodService
    {
        Task<bool> EodPaymentUpdate(DateOnly date, List<EndOfDayDto> DailyPostingList);
    }
}