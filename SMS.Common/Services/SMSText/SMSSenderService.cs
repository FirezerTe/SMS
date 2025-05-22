using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SMS.Common;
using SMSWebService;

namespace SMS.Infrastructure.SMSTextSender
{
    public class SMSSenderService : ISMSWebService
    {
        private readonly IDataService dataService;
        private readonly ILogger logger;
        private readonly IConfiguration configuration;
        public SMSSenderService(IDataService dataService, ILogger<SMSSenderService> logger, IConfiguration configuration)
        {
            this.dataService = dataService;
            this.logger = logger;
            this.configuration = configuration;
        }
        public async Task<bool> IsServiceRunning()
        {
            try
            {
                HttpClient client = new HttpClient();
                string s = await client.GetStringAsync(configuration.GetValue<string>("SMS:WsUrl"));
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                throw;
            }

            return true;
        }
        public async Task<string> SendSMSMessage(int Id)
        {
            XAServiceClient XAServiceClient = new XAServiceClient();

            sendMessageResponse resp = new sendMessageResponse();
            var smsText = dataService.SMSTexts.FirstOrDefault(s => s.Id == Id);
            bool isRunning = await IsServiceRunning();
            if (isRunning)
            {
                resp = await XAServiceClient.sendMessageAsync(smsText.AlertId, smsText.MobileNumber, smsText.Message);
                var successMessage = "";
                if (resp != null)
                {
                    successMessage = "SMS is sent successfully";

                    smsText.Sent = true;
                    dataService.Save();
                }
                else
                {
                    logger.LogError("Failed to send SMS, : {error}{email}", resp);
                    successMessage = "Failed to send SMS";
                }
                return successMessage;


            }
            else
            {
                return "The SMS Text sender service is down. Please check network and contact administrator.";
            }
        }
    }
}