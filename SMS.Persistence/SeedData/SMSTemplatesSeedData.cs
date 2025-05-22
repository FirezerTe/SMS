using Bogus.Bson;
using Bogus.DataSets;
using Bogus;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Bank;
using SMS.Domain.Enums;
using static SMS.Application.Security.UserPermissions;
using RigsWebService;
using System.Runtime.ConstrainedExecution;
using Microsoft.AspNetCore.DataProtection;

namespace SMS.Persistence.SeedData
{
    public static class SMSTemplatesSeedData
    {
        public static async Task SeedAsync(SMSDbContext dbContext)
        {
            foreach (var template in SMSTemplates)
            {
                var _template = await dbContext.SMSTemplates.FirstOrDefaultAsync(t => t.SMSType == template.SMSType);
                if (_template == null)
                {
                    dbContext.SMSTemplates.Add(template);
                }
                else if (template.Template != _template.Template)
                {
                    _template.Template = template.Template;
                }
            }
        }
        private static List<SMSTemplate> SMSTemplates => new List<SMSTemplate>()
        {
             new SMSTemplate()
            {
                SMSType = SMSType.FirstTimePayment ,
                Template = @"Dear {{Name}},you have successfully purchased {{shares}} shares of our bank. Your share ID is {{ShareholderNumber}}, and your current paid-up capital balance is {{paidupamount}}. We extend a warm welcome to you as a valued new shareholder.If you have any enquires please reach out our support team at info@berhanbank@sc.com or +251116623421. Regards, Berhan Bank",

            },
            new SMSTemplate()
            {
                SMSType = SMSType.PaymentMade,
                Template = @"Dear {{Name}}, you have successfully purchased {{shares}} additional shares, thus with share ID {{ShareholderNumber}}, your current paid-up capital balance is ETB  {{paidupamount}}. If you have any enquires please reach out  at info@berhanbank@sc.com or +251116623421.  Regards, Berhan Bank ",
            },
            new SMSTemplate()
            {
                SMSType = SMSType.Transferor,
                Template = @"Dear {{Name}}, you have transferred {{shares}} shares with total value of ETB {{TransactionAmount}} on {{TransferDate}}, thus your current paid-up capital balance is ETB  {{paidupamount}}. If you have any enquires please reach out  at info@berhanbank@sc.com or +251116623421.  Regards, Berhan Bank ",
            },
            new SMSTemplate()
            {
                SMSType = SMSType.Transferee,
                Template = @"Dear {{Name}},{{shares}}shares with total value of ETB {{TransactionAmount}} have been transferred to you from {{TransferorName}} on {{TransferDate}} , thus with Share ID{{ShareholderNumber}}, your current paid-up capital balance is ETB {{paidupamount}}. If you have any enquires please reach out  at info@berhanbank@sc.com or +251116623421.  Regards, Berhan Bank ",
            },
            new SMSTemplate()
             {
                SMSType = SMSType.DividendCaptalize,
                Template = @"Dear {{Name}}, we kindly inform you that your dividend for FY{{FiscalYear}} has been capitalized as per your consent, thus with share ID {{ShareholderNumber}} your current paid-up capital balance is ETB {{paidupamount}} If you any enquires please reach out  at info@berhanbank@sc.com or +251116623421. Regards, Berhan Bank ",
            },
            new SMSTemplate()
             {
                SMSType = SMSType.ShareBlocking,
                Template = @"Dear {{Name}},we have blocked {{shares}} shares with total value of ETB {{TransactionAmount}}, thus your remaining paid-up capital free from blocking is ETB {{paidupamount}} If you any enquires please reach out  at info@berhanbank@sc.com or +251116623421. Regards, Berhan Bank ",
            },
            new SMSTemplate()
             {
                SMSType = SMSType.ShareUnblocking,
                Template = @"Dear {{Name}}, your previously blocked {{shares}} shares with total value of ETB {{TransactionAmount}} have been unblocked, thus your remaining paid-up capital free from blocking is ETB {{paidupamount}} If you any enquires please reach out  at info@berhanbank@sc.com or +251116623421. Regards, Berhan Bank ",
             }

        };

    }
}