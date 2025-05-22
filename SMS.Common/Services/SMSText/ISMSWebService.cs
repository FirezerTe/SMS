namespace SMS.Common
{
    public interface ISMSWebService
    {
        Task<string> SendSMSMessage(int Id);
    }
}
