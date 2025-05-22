using SMS.Domain.Enums;

namespace SMS.Domain
{
    public class Contact : WorkflowEnabledEntity
    {
        public int ShareholderId { get; set; }
        public ContactType Type { get; set; }
        public string Value { get; set; }

        public Shareholder Shareholder { get; set; }
    }
}
