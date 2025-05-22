namespace SMS.Domain;

public class DividendPeriod
{
    public int Id { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public int DayCount { get; set; }
    public string Year { get; set; }

    public DividendSetup? DividendSetup { get; set; }
}
