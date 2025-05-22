using SMS.Domain;

namespace SMS.Common;

public interface IParValueService
{
    public Task<ParValue?> GetCurrentParValue();
}
