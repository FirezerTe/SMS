using SMS.Domain.Enums;

namespace SMS.Domain
{
    public class SMSTemplate
    {
        public int Id { get; set; }
        public SMSType SMSType { get; set; }
        public string Template { get; set; }
    }
}