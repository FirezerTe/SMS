using FluentEmail.Liquid;
using FluentEmail.Smtp;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Mail;

namespace SMS.Common;

public class LocalEmailSenderService : IEmailSenderService
{
    private readonly IDataService dataService;
    private readonly ILogger logger;
    private readonly IConfiguration configuration;

    public LocalEmailSenderService(
        IDataService dataService,
        ILogger<LocalEmailSenderService> logger,
        IConfiguration configuration)
    {
        this.dataService = dataService;
        this.logger = logger;
        this.configuration = configuration;
    }

    public async Task<bool> Send(int id)
    {
        var email = dataService.Emails
            .Include(e => e.EmailTemplate)
            .FirstOrDefault(email => email.Id == id);

        if (email == null)
        {
            logger.LogError("Unable to find email with emailId: {id}", id);
            return false;
        }
        else if (email.Sent)
        {
            logger.LogInformation("Email already sent emailId: {id}", id);
            return true;
        }

        var pickupDirectoryLocation = configuration.GetValue<string>("Email:LocalEmailDropDirectory");
        var senderName = configuration.GetValue<string>("Email:Sender:Name");
        var senderEmailAddress = configuration.GetValue<string>("Email:Sender:EmailAddress");
        if (senderEmailAddress == null)
            throw new Exception("Missing Email:Sender:EmailAddress configuration");

        var sender = new SmtpSender(() => new SmtpClient("localhost")
        {
            EnableSsl = false,
            DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory,
            PickupDirectoryLocation = pickupDirectoryLocation
        });

        FluentEmail.Core.Email.DefaultSender = sender;
        var renderer = new LiquidRenderer(Options.Create(new LiquidRendererOptions()));

        FluentEmail.Core.Email.DefaultRenderer = renderer;

        var _email = await FluentEmail.Core.Email
            .From(senderEmailAddress, senderName ?? null)
            .To(email.ToEmail, email.ToName ?? null)
            .Body(email.Body, email.IsHtml)
            .Subject(email.Subject)
            .SendAsync();


        email.Sent = true;
        dataService.Save();

        return _email.Successful;
    }
}
