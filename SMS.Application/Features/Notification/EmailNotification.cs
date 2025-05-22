using SMS.Domain.Enums;

namespace SMS.Application;

public class EmailNotification
{
    public string ToEmail { get; set; }
    public string ToName { get; set; }
    public string Subject { get; set; }
    public EmailType EmailType { get; set; }
    public object Model { get; set; }
}

