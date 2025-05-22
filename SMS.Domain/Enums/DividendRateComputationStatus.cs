namespace SMS.Domain;

public enum DividendRateComputationStatus
{
    NotStarted = 1,
    Computing = 2,
    Completed = 3,
    CompletedWithError = 4
}
