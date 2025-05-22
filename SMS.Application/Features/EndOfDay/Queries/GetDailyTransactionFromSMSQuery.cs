using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.EndOfDay.Models;
using SMS.Application.Features.Payments.Models;
using SMS.Application.Features.Subscriptions.Models;
using SMS.Application.Lookups;
using SMS.Common.Services.RigsWeb;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Application.Features.EndOfDay.Queries
{
    public class GetDailyTransactionFromSMSQuery : IRequest<DailyTransactionListResponse>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public DateOnly TransactionDate { get; set; }
    }
    public class GetDailyTransactionFromSMSQueryHandler : IRequestHandler<GetDailyTransactionFromSMSQuery, DailyTransactionListResponse>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        private readonly IRigsWebService rigsWebService;

        public GetDailyTransactionFromSMSQueryHandler(IMapper mapper, IDataService dataService, IRigsWebService rigsWebService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
            this.rigsWebService = rigsWebService;

        }
        public async Task<DailyTransactionListResponse> Handle(GetDailyTransactionFromSMSQuery request, CancellationToken cancellationToken)
        {
            var paymentList = await dataService.Payments
                .Where(a => a.ApprovalStatus == Domain.Enums.ApprovalStatus.Approved)
                .ToListAsync();
            var subscriptionList = await dataService.Subscriptions
                .Where(a => a.ApprovalStatus == Domain.Enums.ApprovalStatus.Approved)
                .ToListAsync();
            var branch = await dataService.Branches.ToListAsync();
            var gl = await dataService.GeneralLedgers.Where(a => a.Value == GeneralLedgerTypeEnum.NewShareGl).FirstOrDefaultAsync();
            var DailySubscription = subscriptionList
                .Where(a => DateOnly.FromDateTime(a.SubscriptionDate) == request.TransactionDate
                && (a.IsPosted != true) && (a.PremiumPayment != null))
                .ToList();

            var DailyPayment = paymentList
                .Where(a => (DateOnly.FromDateTime(a.EffectiveDate) == request.TransactionDate) &&
                (a.PaymentTypeEnum == PaymentTypeEnum.SubscriptionPayment) && (a.IsPosted != true) &&
                !paymentList.Any(p => p.ParentPaymentId == a.Id && p.PaymentTypeEnum != PaymentTypeEnum.SubscriptionPayment))
                .ToList();

            var paymentResultDtoList = new List<EndOfDayDto>();
            foreach (var paymentEod in DailyPayment)
            {
                var searchBranch = branch.Where(a => a.Id == paymentEod.BranchId).FirstOrDefault();
                var payResultDto = new EndOfDayDto
                {
                    BranchShareGl = searchBranch.BranchShareGL,
                    Amount = paymentEod.Amount,
                    Date = paymentEod.EffectiveDate,
                    BranchName = searchBranch.BranchName,
                    SubscriptionId = paymentEod.SubscriptionId,
                    TransactionReference = paymentEod.PaymentReceiptNo,
                    AccountType = gl.AccountType,
                    TransactionType = gl.TransactionType,
                    Description = paymentEod.OriginalReferenceNo,
                    Id = paymentEod.Id,
                    PaymentType = paymentEod.PaymentTypeEnum.ToString(),
                    IsPosted = paymentEod.IsPosted,

                };
                paymentResultDtoList.Add(payResultDto);
            }

            var premiumResultDtoList = new List<EndOfDayDto>();
            foreach (var premiumEod in DailySubscription)
            {
                var result = branch.Where(a => a.Id == premiumEod.SubscriptionBranchID).FirstOrDefault();
                var premiumResultDto = new EndOfDayDto
                {
                    BranchShareGl = result.BranchShareGL,
                    Amount = premiumEod?.PremiumPayment ?? 0,
                    Date = premiumEod.SubscriptionDate,
                    BranchName = result.BranchName,
                    SubscriptionId = premiumEod.Id,
                    TransactionReference = premiumEod.PremiumPaymentReceiptNo,
                    AccountType = gl.AccountType,
                    TransactionType = gl.TransactionType,
                    Description = premiumEod.PremiumPaymentReceiptNo,
                    PaymentType = premiumEod.SubscriptionType.ToString(),
                    IsPosted = premiumEod.IsPosted,
                };
                premiumResultDtoList.Add(premiumResultDto);

            }
            var RubiTransactionAmountList = new List<RigsTransaction>();

            foreach (var branchGL in branch.Select(a => a.BranchShareGL).Distinct())
            {
                var RubiTransactionAmount = await rigsWebService
                      .GetAccountHistory(branchGL, request.TransactionDate.ToString("dd/MM/yyyy"), request.TransactionDate.ToString("dd/MM/yyyy"));
                if (RubiTransactionAmount != null)
                {
                    RubiTransactionAmountList.AddRange(RubiTransactionAmount);
                }
            }

            var totalRubiTransactionAmount = RubiTransactionAmountList.Sum(a => a.transactionAmountField);

            var PaymentCount = DailyPayment.Count();
            var SubscriptionCount = DailySubscription.Count();
            var CoreCount = RubiTransactionAmountList.Count();

            var TotalCount = PaymentCount + SubscriptionCount;

            var GeneralLedgerList = await dataService.GeneralLedgers.ToListAsync();
            var PaymentGL = GeneralLedgerList.Where(a => a.Value == GeneralLedgerTypeEnum.PaidUpCapital).FirstOrDefault();
            var PremiumGL = GeneralLedgerList.Where(a => a.Value == GeneralLedgerTypeEnum.PremiumPayment).FirstOrDefault();
            var ShareSaleGL = GeneralLedgerList.Where(a => a.Value == GeneralLedgerTypeEnum.NewShareGl).FirstOrDefault();
            var totalPaymentAmount = DailyPayment.Sum(p => p.Amount);
            var totalPremiumAmount = DailySubscription.Sum(z => z.PremiumPayment);
            var ShareSaleAmount = -(totalPremiumAmount + totalPaymentAmount);
            var paymentInfoList = mapper.Map<List<PaymentInfo>>(DailyPayment);
            var subscriptionInfoForPremiumList = mapper.Map<List<SubscriptionInfo>>(DailySubscription);
            var generalLedgerInfoList = mapper.Map<List<GeneralLedgerDto>>(GeneralLedgerList);

            var branchList = new List<Branch>();
            for (var i = 0; i < DailyPayment.Count; i++)
            {
                var branchShareGl = branch.Where(a => a.Id == DailyPayment[i].BranchId).FirstOrDefault();
                branchList.Add(branchShareGl);
            }

            var branchInfoList = mapper.Map<List<BranchDto>>(branchList);

            var ReconciliationList = paymentResultDtoList.Select(a => new EodReconciliationDto
            {
                TransactionReferenceNumber = a.TransactionReference,
                SMSPaymentAmount = a.Amount,
                BranchName = a.BranchName
            })
                         .Concat(premiumResultDtoList.Select(b => new EodReconciliationDto
                         {
                             TransactionReferenceNumber = b.TransactionReference,
                             SMSPremiumAmount = b.Amount,
                             BranchName = b.BranchName
                         }))
                         .Concat(RubiTransactionAmountList.Select(b => new EodReconciliationDto
                         {
                             TransactionReferenceNumber = b.transactionIdField,
                             CBSAmount = b.transactionAmountField,
                             BranchName = b.businessUnitField
                         }))
                         .GroupBy(q => q.TransactionReferenceNumber)
                         .Select(g => new EodReconciliationDto
                         {
                             TransactionReferenceNumber = g.Key,
                             CBSAmount = g.Sum(q => q.CBSAmount),
                             SMSPaymentAmount = g.Sum(q => q.SMSPaymentAmount),
                             SMSPremiumAmount = g.Sum(q => q.SMSPremiumAmount),
                             Difference = (g.Sum(q => q.CBSAmount)) - ((g.Sum(q => q.SMSPaymentAmount)) + (g.Sum(q => q.SMSPremiumAmount))),
                             BranchName = g.First().BranchName
                         })
                         .ToList();

            var response = new DailyTransactionListResponse
            {
                TotalCoreItems = CoreCount,
                TotalItems = TotalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                PaymentList = paymentInfoList,
                SubscriptionList = subscriptionInfoForPremiumList,
                TotalAmount = totalPaymentAmount,
                TotalPremiumAmount = totalPremiumAmount,
                PaymentGL = PaymentGL.GLNumber,
                PremiumGL = PremiumGL.GLNumber,
                ShareSaleGL = ShareSaleGL.GLNumber,
                GeneralLedgerList = generalLedgerInfoList,
                ShareSaleAmount = ShareSaleAmount,
                BranchList = branchInfoList,
                EndOfDayDtoList = paymentResultDtoList.Concat(premiumResultDtoList).ToList(),
                TotalRubiTransactionAmount = totalRubiTransactionAmount,
                RigsTransactions = RubiTransactionAmountList,
                EodReconciliationDtos = ReconciliationList
            };

            return response;

        }

    }
}