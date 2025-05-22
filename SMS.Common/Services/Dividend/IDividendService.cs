using SMS.Domain;

namespace SMS.Common;

public interface IDividendService
{
    Task<DividendPeriod?> GetCurrentDividendPeriod();
    Task DistributeDividendToShareholders(int dividendSetupId, CancellationToken cancellationToken = default);
    Task<DividendComputationResults> ComputeDividendDecision(List<int> dividendIds, decimal amountToCapitalize)
;
}
