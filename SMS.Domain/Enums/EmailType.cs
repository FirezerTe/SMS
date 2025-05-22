namespace SMS.Domain.Enums
{
    public enum EmailType
    {
        AppUserCreated = 1,
        PaymentMade = 2,
        Subscription = 3,
        AuthenticationCode = 4,
        PasswordChanged = 5,
        ForgotPassword = 6,
        BackgroundJobFailed = 7,
        EODTransactionFailed=8,
    }
}
