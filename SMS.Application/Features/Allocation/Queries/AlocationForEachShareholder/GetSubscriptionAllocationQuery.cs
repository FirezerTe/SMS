using MediatR;

namespace SMS.Application.Features.Allocation.Queries.AlocationForEachShareholder
{
    public class GetSubscriptionAllocationQuery : IRequest<GetSubscriptionAllocationQuery>
    {
        public int Id { get; set; }
        public int ShareholderId { get; set; }
        public decimal SubscriptionAllocationAmount { get; set; }
        public DateTime ExpireDate { get; set; }

    }
}
