using SMS.Application.Features.ShareHolders;

namespace SMS.Application.Features.Subscriptions
{
    public class SubscriptionVM
    {
        public int Id { get; set; }
        public int SubscriptionShareHolderID { get; set; }
        public int SubscriptionAllocationID { get; set; }
        public decimal SubscriptionAmount { get; set; }
        public DateTime SubscriptionExpireDate { get; set; }
        public string SubscriptionDistrictID { get; set; }
        public string SubscriptionBranchID { get; set; }
        public string ApprovedBy { get; set; }
        public string SubscriptionRemark { get; set; }
        public ShareHolderVm ShareHolder { get; set; }
    }
}
