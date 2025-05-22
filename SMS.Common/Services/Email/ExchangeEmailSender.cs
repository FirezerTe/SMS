using FluentEmail.Liquid;
using FluentEmail.Smtp;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;

namespace SMS.Common;

public class ExchangeEmailSenderService : IEmailSenderService
{
    private readonly IDataService dataService;
    private readonly ILogger logger;
    private readonly IConfiguration configuration;

    public ExchangeEmailSenderService(
        IDataService dataService,
        ILogger<ExchangeEmailSenderService> logger,
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
        var exchangeServer = configuration.GetValue<string>("Email:Exchange:Server");
        var exchangePort = configuration.GetValue<int>("Email:Exchange:Port");
        var encryptedUsername = configuration.GetValue<string>("Email:Exchange:Username");
        var encryptedPassword = configuration.GetValue<string>("Email:Exchange:Password");
        var decryptionKey = configuration.GetValue<string>("Email:Exchange:DecryptionKey");

        var exchangeUsername = Decrypt(encryptedUsername, decryptionKey);
        var exchangePassword = Decrypt(encryptedPassword, decryptionKey);

        if (string.IsNullOrWhiteSpace(exchangeServer) || exchangePort <= 0 ||
            string.IsNullOrWhiteSpace(exchangeUsername) || string.IsNullOrWhiteSpace(exchangePassword))
        {
            throw new Exception("Exchange server configuration is incomplete.");
        }
        try
        {
            var sender = new SmtpSender(() => new SmtpClient(exchangeServer)
            {
                Port = exchangePort,
                Credentials = new NetworkCredential(exchangeUsername, exchangePassword),

            });


            var senderName = configuration.GetValue<string>("Email:Sender:Name");
            var senderEmailAddress = configuration.GetValue<string>("Email:Sender:EmailAddress");

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
        catch (Exception ex)
        {
            logger.LogError("Failed to connect to the Exchange server : {error}", ex.Message);
            return false;
        }



    }
    public static string Decrypt(string cipherText, string passPhrase)
    {
        var DerivationIterations = 1000;
        var Keysize = 256;
        var ivAndCipherText = Convert.FromBase64String(cipherText);
        var ivStringBytes = ivAndCipherText.Take(16).ToArray();
        var cipherTextBytes = ivAndCipherText.Skip(16).ToArray();

        using (var passwordDerivation = new Rfc2898DeriveBytes(passPhrase, ivStringBytes, DerivationIterations))
        {
            var keyBytes = passwordDerivation.GetBytes(Keysize / 8);
            using (var symmetricKey = new RijndaelManaged())
            {
                symmetricKey.BlockSize = 128;
                symmetricKey.Mode = CipherMode.CFB;
                symmetricKey.Padding = PaddingMode.PKCS7;
                using (var decryptor = symmetricKey.CreateDecryptor(keyBytes, ivStringBytes))
                {
                    using (var memoryStream = new MemoryStream(cipherTextBytes))
                    {
                        using (var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                        {
                            var plainTextBytes = new byte[cipherTextBytes.Length];
                            var decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                            memoryStream.Close();
                            cryptoStream.Close();
                            return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
                        }
                    }
                }
            }
        }
    }

}