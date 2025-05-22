namespace SMS.Common
{
    public interface IEmailSenderService
    {
        Task<bool> Send(int emailId);
    }
}

