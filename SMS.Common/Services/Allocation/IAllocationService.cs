using SMS.Domain;

namespace SMS.Common;

public interface IAllocationService
{
    Allocation AddNewAllocation(CreateAllocationPayload payload);
    Task<Allocation> AddNewAllocationAndSaveAsync(CreateAllocationPayload payload, CancellationToken cancellationToken);
    Task<Allocation?> IncrementDividendAllocationAmount(decimal? additionalAmount);
    Task ComputeAllocationSummaryAsync(int allocationId, CancellationToken? cancellationToken = default);
    Task ComputeAllocationSummaryForShareholder(int shareholderId, CancellationToken? cancellationToken = default);
    Task ComputeAllocationSummaryForPaymentAsync(int paymentId, CancellationToken? cancellationToken = default);
    Task ComputeShareholderAllocations(int allocationId, CancellationToken? cancellationToken = default);
}