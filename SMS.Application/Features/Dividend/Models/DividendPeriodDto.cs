namespace SMS.Application;


public record DividendPeriodDto(int Id, DateOnly StartDate, DateOnly EndDate, int DayCount, string Year);

