using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Persistence.SeedData
{
    public static class EmailTemplatesSeedData
    {
        public static async Task SeedAsync(SMSDbContext dbContext)
        {
            foreach (var template in EmailTemplates)
            {
                var _template = await dbContext.EmailTemplates.FirstOrDefaultAsync(t => t.EmailType == template.EmailType);
                if (_template == null)
                {
                    dbContext.EmailTemplates.Add(template);
                }
                else if (template.Template != _template.Template)
                {
                    _template.Template = template.Template;
                }
            }
        }
        private static List<EmailTemplate> EmailTemplates => new List<EmailTemplate>()
        {
            new EmailTemplate()
            {
                EmailType = EmailType.AppUserCreated,
                Template = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body> <p>Hi {{Name}},</p> <p> We would like to confirm that your Share Management System (SMS) portal account has successfully been created. To access the portal click the link below. </p> <p> <a href=""{{SmsUrl}}"">{{SmsUrl}}</a> </p> <p> Your temporary password is: <strong>{{TempPassword}}</strong> </p> <p> If you experience any issues please reach out our support team at blablabla@test.com or +251-555-555555. <br /> <p> Regards, <br /> SMS team </p></body></html>",
                IsHtml = true
            },
            new EmailTemplate()
            {
                EmailType = EmailType.Subscription,
                Template = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body><p>Hi {{Name}},</p> <p> You have successfully subscribed birr = {{SubscribedAmount}} </p> <p> </p> <p> If you experience any issues please reach out our support team at blablabla@test.com or +251-555-555555. <br /> <p> Regards, <br /> SMS team </p></body></html>",
                IsHtml = true
            },
            new EmailTemplate()
            {
                EmailType = EmailType.PaymentMade,
                Template = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body><p>Hi {{Name}},</p> <p> We would like to confirm that your payment  has successfully been made. </p>  <p> Your Paid up amount is: <strong>{{paidupamount}}</strong> </p> <p> If you experience any issues please reach out  at berhanbank@sc.com or +251-555-555555. <br /> <p> Regards, <br /> Berhan Bank </p></body></html>",
                IsHtml = true
            },
            new EmailTemplate{
                EmailType= EmailType.AuthenticationCode,
                Template = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body><p>Hi {{Name}},</p><p> Please use the below verification code to complete your sign in process.</p><p style=""font-weight:bold;font-size: 125%""> {{Code}} </p><p> Please do not share this code with anyone.</p><p> If you experience any issues please reach out our support team at blablabla@test.com or +251-555-555555. <br /><p> Regards, <br /> SMS team </p></body></html>",
                IsHtml=true
            },
            new EmailTemplate{
                EmailType= EmailType.PasswordChanged,
                Template = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body><p>Hi {{Name}},</p><p> Your SMS password was recently changed. If you requested this change, you can ignore this email. Otherwise, please contact the SMS Team at blablabla@test.com or +251-555-555555. <br /><p> Regards, <br /> SMS team </p></body></html>",
                IsHtml=true
            },
            new EmailTemplate{
                EmailType= EmailType.ForgotPassword,
                Template = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body><p>Hi {{Name}},</p><p>You recently initiated a password reset for your SMS account. Please click the link below to reset your password. </p><br /><p> <a style=""font-weight:bold;font-size: 125%"" href=""{{Url}}"">Reset Password</a></p><br/> <p>If you did not initiate a password reset please contact us at blablabla@test.com or +251-555-555555.</p><br /><p> Regards, <br /> SMS team </p> </body></html>",
                IsHtml=true
            },
            new EmailTemplate{
                EmailType = EmailType.BackgroundJobFailed,
                Template=@"<html style=""font-family: Arial, sans-serif, 'Open Sans'""> <body> <p>This is to notify you that Job# {{JobId}} has failed. Please look into it as soon as possible.</p> <br /> <p>Failed at: {{FailedAt}}</p><p>Server: {{Server}}</p> <p>Exception:</p> <p><pre> {{Exception}}</pre></p> <br /> <p> Regards, <br /> SMS Team </p> </body> </html>",
                IsHtml=true
            },
           new EmailTemplate
                        {
                            EmailType = EmailType.EODTransactionFailed,
                            Template = @"
                        <html style=""font-family: Arial, sans-serif, 'Open Sans'"">
                        <body>
                            <p> Dear SMS Buisness Team, </p>
                        <p>
                       This is to inform you that the End of Day (EOD) operation encountered diffrence issues with the transactions listed below. We kindly request your immediate attention to resolve these discrepancies.</p>
                            <table style=""width: 100%; border-collapse: collapse;"">
                                <thead>
                                    <tr style=""background-color: #f2f2f2;"">
                                        <th style=""padding: 10px; text-align: left;"">Branch Name</th>
                                        <th style=""padding: 10px; text-align: left;"">Transaction Reference Number</th>
                                        <th style=""padding: 10px; text-align: left;"">SMSPaymentAmount</th>
                                        <th style=""padding: 10px; text-align: left;"">SMSPremiumAmount</th>
                                        <th style=""padding: 10px; text-align: left;"">CBSAmount</th>
                                        <th style=""padding: 10px; text-align: left;"">Difference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {{transactionList}}
                                </tbody>
                            </table>
                        </body>
                        </html>",
                        IsHtml = true
}


        };

    }
}
