using SMS.Domain.Enums;

namespace SMS.Domain
{
    public class EmailTemplate
    {
        public int Id { get; set; }
        public EmailType EmailType { get; set; }
        public string Template { get; set; }
        public bool IsHtml { get; set; }
    }
}
