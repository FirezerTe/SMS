namespace SMS.Domain;

public enum ShareholderChangeLogEntityType
{
    BasicInfo = 1,
    Payment = 2,
    Subscription = 3,
    Transfer = 4,
    Blocked = 5,
    Unblocked = 6,
    Contact = 7,
    Address = 8,
    DividendDecision = 9,
    Certificate = 10,
}

public enum ChangeType
{
    Added = 1,
    Modified = 2,
    Deleted = 3,
    Blocked = 4,
    Unblocked = 5,
    Deactivated = 6,
}
