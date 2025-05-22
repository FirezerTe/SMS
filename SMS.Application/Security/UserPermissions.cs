namespace SMS.Application.Security;

public class UserPermissions
{
    public static class Shareholder
    {
        public static class PersonalInfo
        {
            public const string View = "shareholder.personalInfo.view";
            public const string Edit = "shareholder.personalInfo.edit";
            public const string Approve = "shareholder.personalInfo.approve";
        }

        public static class PowerOfAttorney
        {
            public const string View = "shareholder.powerOfAttorney.view";
            public const string Edit = "shareholder.powerOfAttorney.edit";
            public const string Approve = "shareholder.powerOfAttorney.approve";
        }

        public static class BlockedStatus
        {
            public const string View = "shareholder.blockStatus.view";
            public const string Edit = "shareholder.blockStatus.edit";
            public const string Approve = "shareholder.blockStatus.approve";
        }

        public static class Relatives
        {
            public const string View = "shareholder.relatives.view";
            public const string Edit = "shareholder.relatives.edit";
            public const string Approve = "shareholder.relatives.approve";
        }

        public static class InActiveState
        {
            public const string View = "shareholder.inActiveState.view";
            public const string Edit = "shareholder.inActiveState.edit";
            public const string Approve = "shareholder.inActiveState.approve";
        }
    }

    public static class Payment
    {
        public static class Collect
        {
            public static class View
            {
                public const string Returned = "payment.collect.view.returned";
                public const string Pending = "payment.collect.view.pending";

            }
            public const string Edit = "payment.collect.edit";
            public const string Approve = "payment.collect.approve";
            public const string Return = "payment.collect.return";
            public const string Add = "payment.collect.add";
            public const string Discard = "payment.collect.discard";

        }


        public static class Refund
        {
            public static class View
            {
                public const string ReversePending = "payment.Refund.view.ReversePending";
                public const string Appproved = "payment.Refund.view.approved";

            }

            public const string Edit = "payment.refund.edit";
            public const string Add = "payment.refund.add";
            public const string Approve = "payment.refund.approve";

        }
    }

    public static class Subscription
    {

        public const string Add = "subscription.add";
        public const string Cancel = "subscription.cancel";
        public const string Approve = "subscription.approve";
        public const string Returned = "subscription.returned";
        public const string Reverse = "subscription.Reverse";
        public const string ReverseApprove = "subscription.ReverseApprove";

    }

    //allocation
    public static class Allocation
    {
        public static class View
        {
            public const string Returned = "allocation.view.returned";
            public const string Pending = "allocation.view.pending";
            public const string AllView = "allocation.view.allView";

        }

        public const string Add = "allocation.add";
        public const string Approve = "allocation.approve";

    }

    public static class Transfer
    {
        public static class View
        {
            public const string Returned = "transfer.view.returned";
            public const string Pending = "transfer.view.pending";
            public const string AllView = "transfer.view.allView";

        }
        public static class update
        {
            public const string Edit = "transfer.update.edit";

        }


        public const string Add = "transfer.add";
        public const string Approve = "transfer.approve";
        public const string Discard = "transfer.discard";
        public const string Return = "transfer.return";
        public const string Reverse = "transfer.reverse";
        public const string ReverseApprove = "transfer.reverseApprove";


    }
    public static class User
    {
        public const string View = "user.view";
        public const string Edit = "user.edit";
        public const string Disable = "user.disable";
        public const string Enable = "user.enable";

    }

    public static class EndOfDay
    {
        public const string Process = "EndOfDay.process";

    }
}
