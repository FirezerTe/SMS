namespace SMS.Application.Security;

public class AuthPolicy
{
    //Allocation
    public const string CanCreateOrUpdateAllocation = "CanCreateOrUpdateAllocation";
    public const string CanApproveAllocation = "CanApproveAllocation";
    public const string CanCreateOrUpdateBankAllocation = "CanCreateOrUpdateBankAllocation";
    public const string CanApproveBankAllocation = "CanApproveBankAllocation";

    //Dividend Setup
    public const string CanCreateOrUpdateDividendSetup = "CanCreateOrUpdateDividendSetup";
    public const string CanApproveDividendSetup = "CanApproveDividendSetup";

    //ParValue
    public const string CanCreateOrUpdateParValue = "CanCreateOrUpdateParValue";
    public const string CanApproveParValue = "CanApproveParValue";

    //SubscriptionGroup
    public const string CanCreateOrUpdateSubscriptionGroup = "CanCreateOrUpdateSubscriptionGroup";

    //Shareholder
    public const string CanCreateOrUpdateShareholderInfo = "CanCreateOrUpdateShareholderInfo";
    public const string CanSubmitShareholderApprovalRequest = "CanSubmitShareholderApprovalRequest";
    public const string CanApproveShareholder = "CanApproveShareholder";

    //subscription
    public const string CanCreateOrUpdateSubscription = "CanCreateOrUpdateSubscription";

    //payment
    public const string CanCreateOrUpdatePayment = "CanCreateOrUpdatePayment";

    //transfer
    public const string CanCreateOrUpdateTransfer = "CanCreateOrUpdateTransfer";

    //admin
    public const string CanCreateOrUpdateUser = "CanCreateOrUpdateUser";

    //EndOfDay
    public const string CanProcessEndOfDay = "CanProcessEndOfDay";
}
