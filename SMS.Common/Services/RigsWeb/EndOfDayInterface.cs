using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SMS.Domain.Enums;

namespace SMS.Common.Services.RigsWeb
{
    public class EndOfDayInterface : IEodService
    {
        private readonly IMediator mediator;
        private readonly IDataService dataService;
        private readonly IRigsWebService rigsWebService;
        private readonly IConfiguration configuration;
        public EndOfDayInterface(IMediator mediator, IDataService dataService, IRigsWebService rigsWebService, IConfiguration configuration)
        {
            this.mediator = mediator;
            this.dataService = dataService;
            this.rigsWebService = rigsWebService;
            this.configuration = configuration;
        }
        public async Task<bool> EodPaymentUpdate(DateOnly date, List<EndOfDayDto> DailyPostingList)

        {
            var MaxBatchItem = configuration.GetValue<int>("MaximumBatchItem");
            var DebitPosingList = DailyPostingList.Where(a => a.TransactionType == RigsTransactionType.DR.ToString()).ToList();
            var GeneralLedgerList = await dataService.GeneralLedgers.ToListAsync();
            var PaymentGL = GeneralLedgerList.Where(a => a.Value == GeneralLedgerTypeEnum.PaidUpCapital).FirstOrDefault();
            var PremiumGL = GeneralLedgerList.Where(a => a.Value == GeneralLedgerTypeEnum.PremiumPayment).FirstOrDefault();
            var paymentList = await dataService.Payments
                .Where(a => a.ApprovalStatus == Domain.Enums.ApprovalStatus.Approved)
                .ToListAsync();
            var subscriptionList = await dataService.Subscriptions
                .Where(a => a.ApprovalStatus == Domain.Enums.ApprovalStatus.Approved)
                .ToListAsync();
            var DailySubscription = subscriptionList
               .Where(a => DateOnly.FromDateTime(a.SubscriptionDate) == date && (a.PremiumPayment != null)
                 && DailyPostingList.Any(b => b.TransactionReference == a.PremiumPaymentReceiptNo))
               .ToList();
            var DailyPayment = paymentList
                .Where(a => (DateOnly.FromDateTime(a.EffectiveDate) == date) &&
                (a.PaymentTypeEnum == PaymentTypeEnum.SubscriptionPayment) &&
                !paymentList.Any(p => p.ParentPaymentId == a.Id && p.PaymentTypeEnum != PaymentTypeEnum.SubscriptionPayment)
                && DailyPostingList.Any(b => b.TransactionReference == a.PaymentReceiptNo))
                .ToList();
            var batch = await dataService.BatchReferenceDescriptions.Where(a => a.Value == BatchDescriptionEnum.SMS_EOD_Post).FirstOrDefaultAsync();
            string batchReference = batch.Description + DateTime.UtcNow;
            string EndOfDayPosting = PostingType.EndOfDayPosting.ToString();
            foreach (var payment in DailyPayment)
            {
                var searchPayment = paymentList.Where(p => p.Id == payment.Id).FirstOrDefault();
                searchPayment.IsPosted = true;
                searchPayment.SkipStateTransitionCheck = true;
            }

            foreach (var premium in DailySubscription)
            {
                var searchSubscription = subscriptionList.Where(p => p.Id == premium.Id).FirstOrDefault();
                searchSubscription.IsPosted = true;
                searchSubscription.SkipStateTransitionCheck = true;
            }

            var isRigsRunning = await rigsWebService.IsWebServiceRunning();
            if (isRigsRunning == true)
            {
                if (DebitPosingList.Count > MaxBatchItem)
                {

                    var dividedRecords = DebitPosingList
                                            .Select((dto, i) => new { Index = i, Value = dto })
                                            .GroupBy(x => x.Index / 2)
                                            .Select(x => x.Select(v => v.Value).ToList())
                                            .ToList();

                    foreach (var records in dividedRecords)
                    {
                        var receiptNumber = records.Select(a => a.TransactionReference).LastOrDefault();
                        var ResultDtoList = new List<EndOfDayDto>();
                        var PostingDtoList = new List<EndOfDayDto>();
                        var Premium = records.Where(a => a.PaymentType == SubscriptionTypeEnum.New.ToString()).ToList();
                        var Paidup = records.Where(a => a.PaymentType == PaymentTypeEnum.SubscriptionPayment.ToString()).ToList();
                        var payResultDto = new EndOfDayDto
                        {
                            BranchShareGl = PaymentGL.GLNumber,
                            Amount = Paidup.Sum(a => a.Amount),
                            AccountType = RigsTransactionType.GL.ToString(),
                            TransactionType = RigsTransactionType.CR.ToString()

                        };
                        ResultDtoList.Add(payResultDto);

                        var premiumResultDto = new EndOfDayDto
                        {
                            BranchShareGl = PremiumGL.GLNumber,
                            Amount = Premium.Sum(a => a.Amount),
                            AccountType = RigsTransactionType.GL.ToString(),
                            TransactionType = RigsTransactionType.CR.ToString()

                        };
                        ResultDtoList.Add(premiumResultDto);
                        PostingDtoList = ResultDtoList.Concat(Premium).Concat(Paidup).ToList();
                        await rigsWebService.PostTransaction(PostingDtoList, batchReference, date, EndOfDayPosting);

                    }

                }
                else
                {
                    var ResultDtoList = new List<EndOfDayDto>();
                    var PostingDtoList = new List<EndOfDayDto>();
                    var Premium = DebitPosingList.Where(a => a.PaymentType == SubscriptionTypeEnum.New.ToString()).ToList();
                    var Paidup = DebitPosingList.Where(a => a.PaymentType == PaymentTypeEnum.SubscriptionPayment.ToString()).ToList();
                    var payResultDto = new EndOfDayDto
                    {
                        BranchShareGl = PaymentGL.GLNumber,
                        Amount = Paidup.Sum(a => a.Amount),
                        AccountType = RigsTransactionType.GL.ToString(),
                        TransactionType = RigsTransactionType.CR.ToString()

                    };
                    ResultDtoList.Add(payResultDto);

                    var premiumResultDto = new EndOfDayDto
                    {
                        BranchShareGl = PremiumGL.GLNumber,
                        Amount = Premium.Sum(a => a.Amount),
                        AccountType = RigsTransactionType.GL.ToString(),
                        TransactionType = RigsTransactionType.CR.ToString()

                    };
                    ResultDtoList.Add(premiumResultDto);
                    PostingDtoList = ResultDtoList.Concat(Premium).Concat(Paidup).ToList();

                    await rigsWebService.PostTransaction(PostingDtoList, batchReference, date, EndOfDayPosting);
                }


            }

            return true;
        }
    }
}