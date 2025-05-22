using AutoMapper;
using FluentValidation;
using MediatR;
using SMS.Application.Features.EndOfDay.Queries;
using SMS.Common.Services.RigsWeb;
using SMS.Domain.Enums;

namespace SMS.Application.Features.EndOfDay.Commands
{
    public class ProcessEodCommandValidator : AbstractValidator<ProcessEodCommand>
    {
        private readonly IDataService dataService;
        private readonly IMediator mediator;
        private readonly IMapper mapper;

        public ProcessEodCommandValidator(IDataService dataService, IMediator mediator, IMapper mapper)
        {
            this.dataService = dataService;
            this.mediator = mediator;
            this.mapper = mapper;
            //RuleFor(p => p)
            //   .Must(IsDailyTxnEqual)
            //   .WithMessage("Total Transaction from Rubikon and SMS is Not Equal. Please clear the Difference");
            RuleFor(p => p)
              .Must(IsPaymentExist)
              .WithMessage("No transaction record from Share Management System");
            RuleFor(p => p)
             .Must(IsCoreTransactionExist)
             .WithMessage("No transaction record from Rubikon CBS");

            RuleFor(p => p)
            .Must(GetMatchedTransactions)
            .WithMessage("Transaction Record has a difference or its null please check before processing Eod");

            //RuleFor(p => p)
            // .Must(command => GetMissingTransactions(command).Count == 0)
            // .WithMessage(command => $"Transaction records not found on Rubikon CBS: {string.Join(", ", GetMissingTransactions(command).Select(t => t.TransactionReference))}");

            //RuleFor(p => p)
            // .Must(command => GetPaymenPostedTransactions(command).Count == 0)
            // .WithMessage(command => $"Transaction records Posted on SMS: {string.Join(", ", GetPaymenPostedTransactions(command).Select(t => t.TransactionReference))}");

        }

        private bool IsPaymentExist(ProcessEodCommand command)
        {

            var result = mediator.Send(new GetDailyTransactionFromSMSQuery()
            {
                TransactionDate = command.Date
            });

            return !(result.Result.PaymentList.Count == 0 && result.Result.SubscriptionList.Count == 0);
        }

        private List<EndOfDayDto> GetPaymenPostedTransactions(ProcessEodCommand command)
        {
            var result = mediator.Send(new GetDailyTransactionFromSMSQuery()
            {
                TransactionDate = command.Date
            });
            var paymentTransactions = command.DailyTransactionListEOD
                .Where(txn => txn.PaymentType == PaymentTypeEnum.SubscriptionPayment.ToString() &&
                               !result.Result.PaymentList.Any(a => a.IsPosted == txn.IsPosted))
                .ToList();
            var subscriptionTransactions = command.DailyTransactionListEOD
               .Where(txn => txn.PaymentType == SubscriptionTypeEnum.New.ToString() &&
                              !result.Result.PaymentList.Any(a => a.IsPosted == txn.IsPosted))
               .ToList();


            return paymentTransactions.Concat(subscriptionTransactions).ToList();
        }


        private List<EndOfDayDto> GetMissingTransactions(ProcessEodCommand command)
        {
            var result = mediator.Send(new GetDailyTransactionFromSMSQuery()
            {
                TransactionDate = command.Date
            });


            var missingTransactions = result.Result.EndOfDayDtoList
                .Where(smsTxn => result.Result.RigsTransactions.All(a => a.transactionIdField != smsTxn.TransactionReference))
                .ToList();

            return missingTransactions;
        }

        private bool GetMatchedTransactions(ProcessEodCommand command)
        {
            var result = mediator.Send(new GetDailyTransactionFromSMSQuery()
            {
                TransactionDate = command.Date
            });


            var matchedTransactions = result.Result.EndOfDayDtoList
                .Where(smsTxn => result.Result.RigsTransactions.Any(a => a.transactionIdField == smsTxn.TransactionReference))
                .ToList();

            return !(matchedTransactions.Count == 0);
        }
        private bool IsCoreTransactionExist(ProcessEodCommand command)
        {
            var result = mediator.Send(new GetDailyTransactionFromSMSQuery()
            {
                TransactionDate = command.Date
            });

            return !(result.Result.RigsTransactions.Count == 0);
        }
        private bool IsDailyTxnEqual(ProcessEodCommand command)
        {
            var result = mediator.Send(new GetDailyTransactionFromSMSQuery()
            {
                TransactionDate = command.Date
            });

            var totalRubikonAmount = result.Result.TotalRubiTransactionAmount;
            var totalSmsAmount = result.Result.TotalAmount + result.Result.TotalPremiumAmount;

            return !(totalRubikonAmount != totalSmsAmount);
        }

    }
}