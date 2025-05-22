namespace SMS.Domain
{
    public enum PaymentStatus
    {
        Pending = 1,
        Approved = 2,
        Returned = 3,
        ReversePending = 4,
        Reversed = 5,
        Posted = 6,
        Discard=7,
        ReverseApproved=8,
        Transferred=9
    }
}
