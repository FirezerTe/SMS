using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Common.Services.RigsWeb;
using SMS.Domain.Enums;

namespace SMS.Common.Services.Posting
{
    public class TaxDueDatePostingInterface : ITaxDuePostingService
    {
        private readonly IMediator mediator;
        private readonly IDataService dataService;
        private readonly IRigsWebService rigsWebService;
        public TaxDueDatePostingInterface(IMediator mediator, IDataService dataService, IRigsWebService rigsWebService)
        {
            this.mediator = mediator;
            this.dataService = dataService;
            this.rigsWebService = rigsWebService;
        }
        public async Task<bool> TaxDueDateComputing(int setupId)
        {
            var setup = await dataService.DividendSetups.FirstOrDefaultAsync(x => x.Id == setupId);
            var Gl = await dataService.GeneralLedgers.ToListAsync();
            var DividendPosting = new List<EndOfDayDto>();
            var DividendTaxGL = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.DividendTaxGl);
            var UncollectedDividendGL = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.UncollectedDividendGl);
            var DividendPayable = Gl.FirstOrDefault(a => a.Value == GeneralLedgerTypeEnum.DividendPayableGl);
            var postingDate = DateOnly.FromDateTime(DateTime.Now);
            var Decision = await dataService.BatchReferenceDescriptions.Where(a => a.Value == BatchDescriptionEnum.SMS_Div_Uncollected).FirstOrDefaultAsync();
            var batchReference = Decision.Description + setup.DividendPeriodId + "P/" + postingDate;
            string TaxPosting = PostingType.TaxPendPosting.ToString();
            var dividendDecision = await dataService.DividendDecisions.Where(a => a.TaxApplied == true && a.Decision == DividendDecisionType.Pending
                                                               && !a.TaxProcessed && a.Dividend.DividendSetupId == setupId)
                                                                    .Include(a => a.Dividend).ToListAsync();
            if (dividendDecision.Count > 0)
            {
                var TotalTax = dividendDecision.Sum(a => a.Tax);
                var TotalDividendAmount = dividendDecision.Sum(a => a.Dividend.DividendAmount);
                var TotalUncollectedAmount = TotalDividendAmount - TotalTax;

                DividendPosting.Add(new EndOfDayDto
                {
                    BranchShareGl = DividendTaxGL.GLNumber,
                    Amount = TotalTax,
                    TransactionType = RigsTransactionType.CR.ToString(),
                    AccountType = RigsTransactionType.GL.ToString(),
                    Description = Decision.Description + setup.DividendPeriodId
                });

                DividendPosting.Add(new EndOfDayDto
                {
                    BranchShareGl = UncollectedDividendGL.GLNumber,
                    Amount = TotalUncollectedAmount,
                    TransactionType = RigsTransactionType.CR.ToString(),
                    AccountType = RigsTransactionType.GL.ToString(),
                    Description = Decision.Description + setup.DividendPeriodId
                });

                DividendPosting.Add(new EndOfDayDto
                {
                    BranchShareGl = DividendPayable.GLNumber,
                    Amount = TotalDividendAmount,
                    TransactionType = RigsTransactionType.DR.ToString(),
                    AccountType = RigsTransactionType.GL.ToString(),
                    Description = Decision.Description + setup.DividendPeriodId
                });


                foreach (var item in dividendDecision)
                    item.TaxProcessed = true;
                dataService.Save();
                var isRigsRunning = await rigsWebService.IsWebServiceRunning();
                if (isRigsRunning == true)
                {
                    await rigsWebService.PostTransaction(DividendPosting, batchReference, postingDate, TaxPosting);
                }

            }

            return false;
        }
    }
}