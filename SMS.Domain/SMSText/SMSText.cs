namespace SMS.Domain
{
    public class SMSText
    {
        public int Id { get; set; }
        public string AlertId { get; set; }
        public string MobileNumber { get; set; }
        public string Message { get; set; }
        public bool Sent { get; set; }

    }
}