using Microsoft.EntityFrameworkCore;
using SMS.Domain;

namespace SMS.Application;

public class ShareholderChangeLogService : IShareholderChangeLogService
{
    private readonly IDataService dataService;

    public ShareholderChangeLogService(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task LogChange(int shareholderId, int entityId, ShareholderChangeLogEntityType entityType, ChangeType changeType, CancellationToken cancellationToken = default)
    {

        var changeLog = await dataService.ShareholderChangeLogs.AnyAsync(c => c.ShareholderId == shareholderId
                                                                                       && c.EntityId == entityId
                                                                                       && c.EntityType == entityType);

        if (!changeLog)
        {
            dataService.ShareholderChangeLogs.Add(new ShareholderChangeLog
            {
                ChangeType = changeType,
                EntityType = entityType,
                EntityId = entityId,
                ShareholderId = shareholderId,
            });

            await dataService.SaveAsync(cancellationToken);
        }
    }

    public async Task LogContactChange(Contact contact, ChangeType changeType, CancellationToken cancellationToken = default)
    {
        await LogChange(contact.ShareholderId, contact.Id, ShareholderChangeLogEntityType.Contact, changeType, cancellationToken);
    }

    public async Task LogPaymentChange(Payment payment, ChangeType changeType, CancellationToken cancellationToken = default)
    {
        var shareholderId = await this.GetPaymentShareholderId(payment);
        if (shareholderId.HasValue)
            await LogChange(shareholderId.Value, payment.Id, ShareholderChangeLogEntityType.Payment, changeType, cancellationToken);
    }

    public async Task LogShareholderBasicInfoChange(Shareholder shareholder, ChangeType changeType, CancellationToken cancellationToken = default)
    {
        await LogChange(shareholder.Id, shareholder.Id, ShareholderChangeLogEntityType.BasicInfo, changeType, cancellationToken);
    }

    public async Task LogDividendDecisionChange(int shareholderId, int decisionId, ChangeType changeType, CancellationToken cancellationToken = default)
    {
        await LogChange(shareholderId, decisionId, ShareholderChangeLogEntityType.DividendDecision, changeType, cancellationToken);
    }

    public async Task LogShareholderBlockageChange(Shareholder shareholder, ChangeType changeType, CancellationToken cancellationToken = default)
    {
        await LogChange(shareholder.Id,
                        shareholder.Id,
                        changeType == ChangeType.Blocked ? ShareholderChangeLogEntityType.Blocked : ShareholderChangeLogEntityType.Unblocked,
                        changeType,
                        cancellationToken);
    }

    public async Task LogSubscriptionChange(Subscription subscription, ChangeType changeType, CancellationToken cancellationToken = default)
    {
        await LogChange(subscription.ShareholderId, subscription.Id, ShareholderChangeLogEntityType.Subscription, changeType, cancellationToken);
    }

    public async Task LogTransferChange(Transfer transfer, ChangeType changeType, CancellationToken cancellationToken = default)
    {
        if (changeType == ChangeType.Deleted)
        {
            var changeLog = await dataService.ShareholderChangeLogs.AnyAsync(c => c.ShareholderId == transfer.FromShareholderId
                                                                                     && c.EntityId == transfer.Id
                                                                                     && c.ChangeType == ChangeType.Deleted
                                                                                     && c.EntityType == ShareholderChangeLogEntityType.Transfer);
            if (!changeLog)
            {
                dataService.ShareholderChangeLogs.Add(new ShareholderChangeLog
                {
                    ChangeType = changeType,
                    EntityType = ShareholderChangeLogEntityType.Transfer,
                    EntityId = transfer.Id,
                    ShareholderId = transfer.FromShareholderId,
                });

                await dataService.SaveAsync(cancellationToken);
            }
            return;

        }

        await LogChange(transfer.FromShareholderId, transfer.Id, ShareholderChangeLogEntityType.Transfer, changeType, cancellationToken);
    }

    public async Task LogAddressChange(Address address, ChangeType changeType, CancellationToken cancellationToken = default)
    {
        await LogChange(address.ShareholderId, address.Id, ShareholderChangeLogEntityType.Address, changeType, cancellationToken);
    }

    private async Task<int?> GetPaymentShareholderId(Payment payment)
    {
        return await dataService.Subscriptions.Where(p => p.Id == payment.SubscriptionId)
                                                          .Select(s => s.ShareholderId)
                                                          .FirstOrDefaultAsync();
    }
    public async Task LogCertificateChange(Certficate certficate, ChangeType changeType, CancellationToken cancellationToken = default)
    {
        await LogChange(certficate.ShareholderId, certficate.Id, ShareholderChangeLogEntityType.Certificate, changeType, cancellationToken);
    }
    public async Task Clear(int shareholderId, CancellationToken cancellationToken = default)
    {
        var changeLogs = await dataService.ShareholderChangeLogs.Where(c => c.ShareholderId == shareholderId).ToListAsync();
        dataService.ShareholderChangeLogs.RemoveRange(changeLogs);

        await dataService.SaveAsync(cancellationToken);
    }
}
