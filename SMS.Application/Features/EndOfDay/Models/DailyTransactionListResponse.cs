using SMS.Application.Features.Payments.Models;
using SMS.Application.Features.Subscriptions.Models;
using SMS.Application.Lookups;
using SMS.Common.Services.RigsWeb;

namespace SMS.Application.Features.EndOfDay.Models
{
    public class DailyTransactionListResponse
    {
        public int TotalItems { get; set; }
        public int TotalCoreItems { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalRubiTransactionAmount { get; set; }
        public decimal? TotalPremiumAmount { get; set; }
        public decimal TotalTransferServiceCharge { get; set; }
        public decimal? ShareSaleAmount { get; set; }
        public string? PaymentGL { get; set; }
        public string? PremiumGL { get; set; }
        public string? ShareSaleGL { get; set; }
        public List<BranchDto> BranchList { get; set; }
        public List<PaymentInfo> PaymentList { get; set; }
        public List<SubscriptionInfo> SubscriptionList { get; set; }
        public List<EndOfDayDto> EndOfDayDtoList { get; set; }
        public List<GeneralLedgerDto> GeneralLedgerList { get; set; }
        public List<RigsTransaction> RigsTransactions { get; set; }
        public List<EodReconciliationDto> EodReconciliationDtos { get; set; }
    }
}
