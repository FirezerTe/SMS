using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Bank;
using SMS.Domain.BatchReferenceDescription;
using SMS.Domain.EndOfDay;
using SMS.Domain.GL;
using SMS.Domain.Lookups;
using SMS.Domain.SubscriptionAllocation;
using SMS.Domain.User;

namespace SMS.Common;

public interface IDataService
{
    public DbSet<Country> Countries { get; set; }
    public DbSet<Shareholder> Shareholders { get; set; }
    public DbSet<ApprovedShareholder> ApprovedShareholders { get; set; }
    public DbSet<DraftShareholder> DraftShareholders { get; set; }
    public DbSet<ShareholderApprovalRequest> ShareholderApprovalRequests { get; set; }
    public DbSet<RejectedShareholderApprovalRequest> RejectedShareholderApprovalRequests { get; set; }
    public DbSet<ShareholderComment> ShareholderComments { get; set; }
    public DbSet<ShareholderType> ShareholderTypes { get; set; }
    public DbSet<ShareholderChangeLog> ShareholderChangeLogs { get; set; }
    public DbSet<ShareholderStatus> ShareholderStatuses { get; set; }
    public DbSet<BlockedShareholder> BlockedShareholders { get; set; }
    public DbSet<ShareholderBlockReason> ShareholderBlockReasons { get; set; }
    public DbSet<ShareholderBlockType> ShareholderBlockTypes { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<ShareholderDocument> ShareholderDocuments { get; set; }
    public DbSet<Family> Families { get; set; }
    public DbSet<ShareholderFamily> ShareholderFamilies { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<PaymentType> PaymentTypes { get; set; }
    public DbSet<SubscriptionPaymentReceipt> PaymentReceipts { get; set; }
    public DbSet<Branch> Branches { get; set; }
    public DbSet<District> Districts { get; set; }
    public DbSet<Allocation> Allocations { get; set; }
    public DbSet<Share> Shares { get; set; }

    public DbSet<AllocationSubscriptionSummary> AllocationSubscriptionSummaries { get; set; }
    public DbSet<ShareholderAllocation> ShareholderAllocations { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<SubscriptionType> SubscriptionTypes { get; set; }
    public DbSet<SubscriptionDocument> SubscriptionDocuments { get; set; }
    public DbSet<SubscriptionPaymentSummary> SubscriptionPaymentSummaries { get; set; }
    public DbSet<ShareholderSubscriptionSummary> ShareholderSubscriptionsSummaries { get; set; }
    public DbSet<SubscriptionGroup> SubscriptionGroups { get; set; }
    public DbSet<SubscriptionPremium> SubscriptionPremiums { get; set; }

    public DbSet<ParValue> ParValues { get; set; }
    public DbSet<SMSUser> Users { get; set; }
    public DbSet<SMSRole> Roles { get; set; }
    public DbSet<EmailTemplate> EmailTemplates { get; set; }
    public DbSet<Transfer> Transfers { get; set; }
    public DbSet<TransferDocument> TransferDocuments { get; set; }
    public DbSet<TransferType> TransferTypes { get; set; }
    public DbSet<TransferDividendTerm> TransferDividendTerms { get; set; }
    public DbSet<Email> Emails { get; set; }
    public DbSet<SubscriptionAllocation> SubscriptionAllocations { get; set; }
    public DbSet<Bank> Banks { get; set; }
    public DbSet<SharePremiumGL> SharePremiumGLs { get; set; }
    public DbSet<PaymentMethod> PaymentMethods { get; set; }
    public DbSet<ForeignCurrencyType> ForeignCurrencyTypes { get; set; }
    public DbSet<GeneralLedger> GeneralLedgers { get; set; }
    public DbSet<DailySummary> DailySummaries { get; set; }
    public DbSet<BatchPostingResponseDetail> BatchPostingResponseDetails { get; set; }
    public DbSet<BatchPostingHeader> BatchPostingHeaders { get; set; }
    public DbSet<BatchPostingRequest> BatchPostingRequests { get; set; }
    public DbSet<SMSText> SMSTexts { get; set; }
    public DbSet<SMSTemplate> SMSTemplates { get; set; }
    public DbSet<Certficate> Certficates { get; set; }
    public DbSet<CertficateType> CertficateTypes { get; set; }
    public DbSet<DailyEodDifferenceDetail> DailyEodDifferenceDetails { get; set; }

    //Dividend
    public DbSet<DividendPeriod> DividendPeriods { get; set; }
    public DbSet<Dividend> Dividends { get; set; }
    public DbSet<DividendDecision> DividendDecisions { get; set; }
    public DbSet<DividendDecisionDocument> DividendDecisionDocuments { get; set; }
    public DbSet<DividendSetup> DividendSetups { get; set; }
    public DbSet<BatchReferenceDescription> BatchReferenceDescriptions { get; set; }
    public DbSet<PaymentsWeightedAverage> PaymentsWeightedAverages { get; set; }


    void Save();
    Task SaveAsync(CancellationToken cancellationToken);

    public static string SoundsLike(string sound) => throw new NotImplementedException();
}
