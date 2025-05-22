namespace SMS.Application.Features.Subscriptions.Models
{
    public class SubscriptionListResponse
    {
        public int TotalItems { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public List<SubscriptionInfo> SubscriptionList { get; set; }
    }
}
