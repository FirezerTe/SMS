namespace SMS.Application.Features.Payments.Models
{
    public class PaymentListResponse
    {
        public int TotalItems { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public List<PaymentInfo> PaymentList { get; set; }
    }
}