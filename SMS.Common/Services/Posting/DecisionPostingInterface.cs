using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Common.Services.RigsWeb;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Common.Services.Posting
{
    public class DecisionPostingInterface : IDecisionPostingService
    {
        private readonly IMediator mediator;
        private readonly IDataService dataService;
        private readonly IRigsWebService rigsWebService;
        public DecisionPostingInterface(IMediator mediator, IDataService dataService, IRigsWebService rigsWebService)
        {
            this.mediator = mediator;
            this.dataService = dataService;
            this.rigsWebService = rigsWebService;
        }
        public async Task<bool> DecisionPostingCompute(List<int> Id)
        {
            var PostingCollected = new List<EndOfDayDto>();
            var batchDescription = dataService.BatchReferenceDescriptions.Where(a => a.Value == BatchDescriptionEnum.SMS_Div_DEC).FirstOrDefault();
            var postingDate = DateOnly.FromDateTime(DateTime.Now.Date);
            var batchReference = string.Empty;
            string DividendPosting = PostingType.DividendPosting.ToString();
            foreach (var decisionID in Id)
            {
                var dividends = await dataService.DividendDecisions.Where(d => d.Id == decisionID)
                                                               .Include(d => d.Dividend.DividendSetup)
                                                               .FirstOrDefaultAsync();
                var shareholder = await dataService.Shareholders.FirstOrDefaultAsync(a => a.Id == dividends.Dividend.ShareholderId);

                batchReference = batchDescription.Description + shareholder.Id + "/" + postingDate;

                switch (dividends.Decision)
                {
                    case DividendDecisionType.FullyCapitalize:
                        var CapitalizeList = await ApproveFullyCapitalize(dividends, shareholder.Id);
                        PostingCollected.AddRange(CapitalizeList);
                        break;
                    case DividendDecisionType.FullyPay:
                        var PayList = await ApproveFullyPay(dividends, shareholder.Id);
                        PostingCollected.AddRange(PayList);
                        break;
                    case DividendDecisionType.PartiallyCapitalize:
                        var PartialList = await ApprovePartiallyCapitalize(dividends, shareholder.Id);
                        PostingCollected.AddRange(PartialList);
                        break;
                }
            }
            var isRigsRunning = await rigsWebService.IsWebServiceRunning();
            if (isRigsRunning == true)
            {
                if (PostingCollected.Count > 0)
                {
                    await rigsWebService.PostTransaction(PostingCollected, batchReference, postingDate, DividendPosting);
                }

            }

            return true;
        }

        private async Task<List<EndOfDayDto>> ApproveFullyCapitalize(DividendDecision dividendPayment, int Id)
        {
            var shareholder = await dataService.Shareholders.Where(a => a.Id == Id).FirstOrDefaultAsync();
            var Gl = await dataService.GeneralLedgers.ToListAsync();
            var PaidupCapital = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.PaidUpCapital);
            var DividendPayable = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.DividendPayableGl);
            var UncollectedDividendGL = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.UncollectedDividendGl);
            var HeadOfficeGL = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.NewShareGl);
            var Pending = await dataService.DividendDecisions.Where(a => a.TaxProcessed == true && a.Dividend.ShareholderId == Id
                                                              && a.Dividend.DividendSetupId == dividendPayment.Dividend.DividendSetupId
                                                              && a.DecisionProcessed == false).ToListAsync();
            var Payable = await dataService.DividendDecisions.Where(a => a.TaxProcessed == false && a.Dividend.ShareholderId == Id
                                                              && a.Dividend.DividendSetupId == dividendPayment.Dividend.DividendSetupId
                                                              && a.DecisionProcessed == false).ToListAsync();
            var DividendPosting = new List<EndOfDayDto>();
            var AccountNumber = shareholder.AccountNumber ?? HeadOfficeGL.GLNumber;
            var AccountType = AccountNumber == HeadOfficeGL.GLNumber ? RigsTransactionType.GL.ToString() : RigsTransactionType.DP.ToString();

            if (dividendPayment != null)
            {
                var Amount = dividendPayment.CapitalizedAmount + dividendPayment.FulfillmentPayment;
                if (Pending.Count > 0)
                {
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = AccountNumber,
                        Amount = dividendPayment.FulfillmentPayment,
                        TransactionType = RigsTransactionType.DR.ToString(),
                        AccountType = AccountType,
                        Description = dividendPayment.Decision.ToString()
                    });
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = UncollectedDividendGL.GLNumber,
                        Amount = dividendPayment.CapitalizedAmount,
                        TransactionType = RigsTransactionType.DR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = PaidupCapital.GLNumber,
                        Amount = Amount,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });
                }
                if(Payable.Count>0)
                {
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = AccountNumber,
                        Amount = dividendPayment.FulfillmentPayment,
                        TransactionType = RigsTransactionType.DR.ToString(),
                        AccountType = AccountType,
                        Description = dividendPayment.Decision.ToString()
                    });
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = DividendPayable.GLNumber,
                        Amount = dividendPayment.CapitalizedAmount,
                        TransactionType = RigsTransactionType.DR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = PaidupCapital.GLNumber,
                        Amount = Amount,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });
                }

                dividendPayment.DecisionProcessed = true;
                dividendPayment.SkipStateTransitionCheck = true;
                dataService.Save();
                return DividendPosting;
            }
            return null;
        }
        private async Task<List<EndOfDayDto>> ApproveFullyPay(DividendDecision dividendPayment, int Id)
        {

            var shareholder = await dataService.Shareholders.Where(a => a.Id == Id).FirstOrDefaultAsync();
            var Gl = await dataService.GeneralLedgers.ToListAsync();
            var DividendPayable = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.DividendPayableGl);
            var DividendTax = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.DividendTaxGl);
            var HeadOfficeGL = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.NewShareGl);
            var DividendPosting = new List<EndOfDayDto>();
            var UncollectedDividendGL = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.UncollectedDividendGl);

            var Pending = await dataService.DividendDecisions.Where(a => a.TaxProcessed == true && a.Dividend.ShareholderId == Id
                                                              && a.Dividend.DividendSetupId == dividendPayment.Dividend.DividendSetupId
                                                              && a.DecisionProcessed == false).ToListAsync();
            var Payable = await dataService.DividendDecisions.Where(a => a.TaxProcessed == false && a.Dividend.ShareholderId == Id
                                                              && a.Dividend.DividendSetupId == dividendPayment.Dividend.DividendSetupId
                                                              && a.DecisionProcessed == false).ToListAsync();
            var AccountNumber = shareholder.AccountNumber ?? HeadOfficeGL.GLNumber;
            var AccountType = AccountNumber == HeadOfficeGL.GLNumber ? RigsTransactionType.GL.ToString() : RigsTransactionType.DP.ToString();
            if (dividendPayment != null)
            {
                var Amount = dividendPayment.NetPay + dividendPayment.Tax;
                if (Pending.Count > 0)
                {
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = UncollectedDividendGL.GLNumber,
                        Amount = dividendPayment.NetPay,
                        TransactionType = RigsTransactionType.DR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });

                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = AccountNumber,
                        Amount = dividendPayment.NetPay,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = AccountType,
                        Description = dividendPayment.Decision.ToString()
                    });

                }
                if(Payable.Count>0)
                {
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = DividendTax.GLNumber,
                        Amount = dividendPayment.Tax,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });

                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = AccountNumber,
                        Amount = dividendPayment.NetPay,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = AccountType,
                        Description = dividendPayment.Decision.ToString()
                    });

                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = DividendPayable.GLNumber,
                        Amount = Amount,
                        TransactionType = RigsTransactionType.DR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });
                }
                dividendPayment.DecisionProcessed = true;
                dividendPayment.SkipStateTransitionCheck = true;
                dataService.Save();
                if(DividendPosting.Count>0)
                {
                    return DividendPosting;
                }
                return null;
            }
            return null;
        }

        private async Task<List<EndOfDayDto>> ApprovePartiallyCapitalize(DividendDecision dividendPayment, int Id)
        {

            var today = DateTime.Now;
            var shareholder = await dataService.Shareholders.Where(a => a.Id == Id).FirstOrDefaultAsync();
            var Gl = await dataService.GeneralLedgers.ToListAsync();
            var PaidupCapital = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.PaidUpCapital);
            var DividendPayable = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.DividendPayableGl);
            var DividendTax = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.DividendTaxGl);
            var HeadOfficeGL = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.NewShareGl);
            var DividendPosting = new List<EndOfDayDto>();
            var UncollectedDividendGL = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.UncollectedDividendGl);

            var Pending = await dataService.DividendDecisions.Where(a => a.TaxProcessed == true && a.Dividend.ShareholderId == Id
                                                              && a.Dividend.DividendSetupId == dividendPayment.Dividend.DividendSetupId
                                                              && a.DecisionProcessed == false).ToListAsync();
            var Payable = await dataService.DividendDecisions.Where(a => a.TaxProcessed == false && a.Dividend.ShareholderId == Id
                                                            && a.Dividend.DividendSetupId == dividendPayment.Dividend.DividendSetupId
                                                            && a.DecisionProcessed == false).ToListAsync();
            var AccountNumber = shareholder.AccountNumber ?? HeadOfficeGL.GLNumber;
            var AccountType = AccountNumber == HeadOfficeGL.GLNumber ? RigsTransactionType.GL.ToString() : RigsTransactionType.DP.ToString();
            if (dividendPayment != null)
            {
                var Amount = dividendPayment.CapitalizedAmount + dividendPayment.NetPay;
                var CurrentYearDividend = Amount + dividendPayment.Tax;
                if (Pending.Count != 0)
                {
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = UncollectedDividendGL.GLNumber,
                        Amount = Amount,
                        TransactionType = RigsTransactionType.DR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });

                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = PaidupCapital.GLNumber,
                        Amount = dividendPayment.CapitalizedAmount,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });

                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = AccountNumber,
                        Amount = dividendPayment.NetPay,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = AccountType,
                        Description = dividendPayment.Decision.ToString()
                    });

                }
                if(Payable.Count>0)
                {
                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = DividendTax.GLNumber,
                        Amount = dividendPayment.Tax,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });

                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = AccountNumber,
                        Amount = dividendPayment.NetPay,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = AccountType,
                        Description = dividendPayment.Decision.ToString()
                    });

                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = PaidupCapital.GLNumber,
                        Amount = dividendPayment.CapitalizedAmount,
                        TransactionType = RigsTransactionType.CR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });

                    DividendPosting.Add(new EndOfDayDto
                    {
                        BranchShareGl = DividendPayable.GLNumber,
                        Amount = CurrentYearDividend,
                        TransactionType = RigsTransactionType.DR.ToString(),
                        AccountType = RigsTransactionType.GL.ToString(),
                        Description = dividendPayment.Decision.ToString()
                    });
                }
                dividendPayment.DecisionProcessed = true;
                dividendPayment.SkipStateTransitionCheck = true;
                dataService.Save();
                return DividendPosting;
            }
            return null;
        }

    }
}