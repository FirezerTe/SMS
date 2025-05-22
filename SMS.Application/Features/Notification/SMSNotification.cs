using SMS.Domain.Enums;

namespace SMS.Application.Features.Notification
{
    public class SMSNotification
    {
        public string AlertId { get; set; }
        public string MobileNumber { get; set; }
        public string message { get; set; }
        public SMSType SMSType { get; set; }
        public object Model { get; set; }
    }

}