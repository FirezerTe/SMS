using SMS.Domain;

namespace SMS.Application;

public interface IShareholderChangeLogService
{
    public Task LogChange(int shareholderId, int entityId, ShareholderChangeLogEntityType entityType, ChangeType changeType, CancellationToken cancellationToken = default);
    public Task LogPaymentChange(Payment payment, ChangeType changeType, CancellationToken cancellationToken = default);
    public Task LogContactChange(Contact contact, ChangeType changeType, CancellationToken cancellationToken = default);
    public Task LogSubscriptionChange(Subscription subscription, ChangeType changeType, CancellationToken cancellationToken = default);
    public Task LogTransferChange(Transfer transfer, ChangeType changeType, CancellationToken cancellationToken = default);
    public Task LogShareholderBlockageChange(Shareholder shareholder, ChangeType changeType, CancellationToken cancellationToken = default);
    public Task LogShareholderBasicInfoChange(Shareholder shareholder, ChangeType changeType, CancellationToken cancellationToken = default);
    public Task LogAddressChange(Address address, ChangeType changeType, CancellationToken cancellationToken = default);
    public Task Clear(int shareholderId, CancellationToken cancellationToken = default);
    public Task LogDividendDecisionChange(int shareholderId, int decisionId, ChangeType changeType, CancellationToken cancellationToken = default);
    public Task LogCertificateChange(Certficate contact, ChangeType changeType, CancellationToken cancellationToken = default);
}