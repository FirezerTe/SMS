namespace SMS.Common;

public interface IShareholderSummaryService
{
    Task<bool> ComputeShareholderSummaries(int shareholderId, bool computeAllocationSummary, CancellationToken cancellationToken);
    Task ComputeAllShareholdersSummary(CancellationToken cancellationToken);
}
