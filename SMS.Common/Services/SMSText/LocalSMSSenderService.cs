using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SMS.Common;

namespace SMS.Infrastructure.SMSTextSender
{
    public class LocalSMSSenderService : ISMSWebService
    {
        private readonly IDataService dataService;
        private readonly ILogger logger;
        private readonly IConfiguration configuration;

        public LocalSMSSenderService(IDataService dataService, ILogger<SMSSenderService> logger, IConfiguration configuration)
        {
            this.dataService = dataService;
            this.logger = logger;
            this.configuration = configuration;
        }

        public async Task<bool> IsServiceRunning()
        {
            return true;
        }

        public async Task<string> SendSMSMessage(int Id)
        {
            var smsText = dataService.SMSTexts.FirstOrDefault(s => s.Id == Id);
            bool isRunning = await IsServiceRunning();

            if (isRunning)
            {
                try
                {
                    string fileName = $"{Guid.NewGuid()}.txt";
                    var pickupDirectoryLocation = configuration.GetValue<string>("SMS:LocalDirectory");
                    string filePath = Path.Combine(pickupDirectoryLocation, fileName);

                    File.WriteAllText(filePath, smsText.Message);

                    smsText.Sent = true;
                    dataService.Save();

                    return "SMS is saved to the local directory successfully";
                }
                catch (Exception ex)
                {
                    logger.LogError("Failed to save SMS to local directory: {error}", ex.Message);
                    return "Failed to save SMS to local directory";
                }
            }
            else
            {
                return "The SMS Text sender service is down. Please contact the administrator.";
            }
        }
    }
}