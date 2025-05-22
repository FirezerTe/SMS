using AutoMapper;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SMS.Application.Features.EndOfDay.Queries;
using SMS.Application.Security;
using SMS.Common.Services.RigsWeb;
using SMS.Domain.EndOfDay;
using SMS.Domain.Enums;

namespace SMS.Application.Features.EndOfDay.Commands
{

    [Authorize(Policy = AuthPolicy.CanProcessEndOfDay)]
    public class ProcessEodCommand : IRequest<RigsResponseDto>
    {
        public List<EndOfDayDto> DailyTransactionListEOD { get; set; }
        public DateOnly Date { get; set; }
        public string Description { get; set; }
    }
    public class ProcessEodCommandHandler : IRequestHandler<ProcessEodCommand, RigsResponseDto>
    {

        private readonly IMapper mapper;
        private readonly IDataService dataService;
        private readonly IRigsWebService rigsWebService;
        private readonly IMediator mediator;
        private readonly IBackgroundJobScheduler backgroundJobService;
        private readonly IServiceProvider serviceProvider;
        public ProcessEodCommandHandler(IMapper mapper, IMediator mediator, IDataService dataService, IRigsWebService rigsWebService, IBackgroundJobScheduler backgroundJobService, IServiceProvider serviceProvider)
        {
            this.mapper = mapper;
            this.dataService = dataService;
            this.rigsWebService = rigsWebService;
            this.mediator = mediator;
            this.backgroundJobService = backgroundJobService;
            this.serviceProvider = serviceProvider;
        }
        public async Task<RigsResponseDto> Handle(ProcessEodCommand request, CancellationToken cancellationToken)
        {
            var result = mediator.Send(new GetDailyTransactionFromSMSQuery()
            {
                TransactionDate = request.Date
            });

            var DifferenceTransactionList = result.Result.EodReconciliationDtos.Where(a => a.Difference != 0).ToList();
            foreach (var difference in DifferenceTransactionList)
            {
                var DailyPosting = new DailyEodDifferenceDetail
                {
                    SMSPaymentAmount = difference.SMSPaymentAmount,
                    SMSPremiumAmount = difference.SMSPremiumAmount,
                    CBSAmount = difference.CBSAmount,
                    BusinessUnit = difference.BranchName,
                    TransactionReferenceNumber = difference.TransactionReferenceNumber,
                    GLNumber = difference.GLNumber,
                    EodDate = request.Date
                };
                dataService.DailyEodDifferenceDetails.Add(DailyPosting);
                dataService.Save();
            }
            if (DifferenceTransactionList != null)
            {
                using (var serviceScope = serviceProvider.CreateScope())
                {
                    var services = serviceScope.ServiceProvider;
                    var configuration = services.GetRequiredService<IConfiguration>();
                    var toEmail = configuration.GetValue<string>("SMS BuisnessTeam Email");
                    var transactionDiffrenceList = "";
                    foreach (var transaction in DifferenceTransactionList)
                    {
                        transactionDiffrenceList += $@"
                    <tr>
                        <td style=""padding: 10px; border-bottom: 1px solid #ddd;"">{transaction.BranchName}</td>
                        <td style=""padding: 10px; border-bottom: 1px solid #ddd;"">{transaction.TransactionReferenceNumber}</td>
                        <td style=""padding: 10px; border-bottom: 1px solid #ddd;"">{transaction.SMSPaymentAmount}</td>
                        <td style=""padding: 10px; border-bottom: 1px solid #ddd;"">{transaction.SMSPremiumAmount}</td>
                        <td style=""padding: 10px; border-bottom: 1px solid #ddd;"">{transaction.CBSAmount}</td>
                        <td style=""padding: 10px; border-bottom: 1px solid #ddd;"">{transaction.Difference}</td>
                    </tr>";
                    }

                    await mediator.Send(new CreateEmailNotificationCommand()
                    {
                        Notification = new EmailNotification()
                        {
                            ToEmail = toEmail,
                            ToName = "SMS Buisness Team",
                            EmailType = EmailType.EODTransactionFailed,
                            Subject = "Failed transactions on " + request.Date + "EOD Operation",
                            Model = new
                            {
                                transactionList = transactionDiffrenceList
                            }
                        }
                    });
                }
            }
            var matchedTransactions = result.Result.EndOfDayDtoList
            .Where(smsTxn => result.Result.RigsTransactions.Any(a => a.transactionIdField == smsTxn.TransactionReference))
            .ToList();
            if (matchedTransactions != null)
            {
                backgroundJobService.EnqueueEodPostUpdate(request.Date, matchedTransactions);
            }
            return null;
        }

    }
}