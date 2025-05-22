using SMS.Domain.Enums;

namespace SMS.Common;


public record CreateAllocationPayload(decimal Amount, string Name, DateOnly? FromDate, DateOnly? ToDate, string Description, AllocationType? AllocationType, bool? IsOnlyForExistingShareholders, bool IsDividendAllocation);
