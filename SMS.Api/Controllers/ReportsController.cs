using Microsoft.AspNetCore.Mvc;
using SMS.Api.Dtos;
using SMS.Application.Features.Reports;
using SMS.Application.Features.Reports.Queries;
using SMS.Domain.Enums;
using System.Text;
using System.Text.Json;

namespace SMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : BaseController<ReportsController>
    {
        private readonly IHttpClientFactory factory;
        private readonly string reportServerBaseUrl;

        public ReportsController(IHttpClientFactory factory, IConfiguration configuration) : base()
        {
            this.factory = factory;
            reportServerBaseUrl = configuration.GetValue<string>("ReportServerBaseUrl");
        }

        [HttpGet("share-certificate/{id}", Name = "ShareCertificateReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ShareCertificateReport(int id, int certificateId)
        {
            var reportData = await mediator.Send(new GetShareCertificateReportDataQuery
            {
                ShareholderId = id,
                CertificateId = certificateId
            });

            var file = await GenerateReport("certificate", reportData);
            return File(file, "application/pdf", "share-certificate-report.pdf");
        }

        [HttpGet("shareholder-payments/{id}", Name = "ShareholderPaymentsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ShareholderPaymentsReport(int id, [FromQuery] DateRangeDto dateRange)
        {
            var reportData = await mediator.Send(new GetShareholderPaymentsReportDataQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate,
                ShareholderId = id
            });

            var file = await GenerateReport("shareholder-payments", reportData);
            return File(file, "application/pdf", $"shareholder-payments-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }

        [HttpGet("activeShareholderListForGA", Name = "ActiveShareholderListForGA")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ActiveShareholderListForGA()
        {
            var reportData = await mediator.Send(new GetActiveShareholderListForGADataQuery()
            );

            var file = await GenerateReport("activeShareholderListForGA", reportData);
            return File(file, "application/pdf", $"activeShareholderListForGA-report.pdf");
        }

        [HttpGet("endOfDayDaily", Name = "EndOfDayDailyReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> EndOfDayDailyReport([FromQuery] DateRangeDto dateRange)
        {
            var reportData = await mediator.Send(new GetEndOfDayDailyReportDataQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate,

            });

            var file = await GenerateReport("endOfDayDaily", reportData);
            return File(file, "application/pdf", $"EndOfDayDaily-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }

        [HttpGet("dividend-payments", Name = "DividendPaymentsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> DividendPaymentsReport([FromQuery] DateRangeDto dateRange)
        {
            var reportData = await mediator.Send(new GetDividendPaymentsReportDataQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate
            });

            var file = await GenerateReport("dividend-payments", reportData);
            return File(file, "application/pdf", $"dividend-payments-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }

        [HttpGet("subscriptions/{id}", Name = "SubscriptionsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> SubscriptionsReport(int id, [FromQuery] DateRangeDto dateRange)
        {
            var reportData = await mediator.Send(new GetSubscriptionsReportDataQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate,
                ShareholderId = id

            });

            var file = await GenerateReport("subscriptions", reportData);
            return File(file, "application/pdf", $"subscriptions-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }

        [HttpGet("expiredSubscriptions/{id}", Name = "ExpiredSubscriptionsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ExpiredSubscriptionsReport(int id, [FromQuery] DateRangeDto dateRange)
        {
            var reportData = await mediator.Send(new GetExpiredShareSubscriptionReportDataQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate,
                ShareholderId = id,


            });

            var file = await GenerateReport("expiredSubscriptions", reportData);
            return File(file, "application/pdf", $"expiredSubscriptions-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }

        [HttpGet("outstandingSubscriptions", Name = "OutstandingSubscriptionsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> OutstandingSubscriptionsReport([FromQuery] DateRangeDto dateRange)
        {
            var reportData = await mediator.Send(new GetOutstandingShareSubscriptionReportQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate
            });

            var file = await GenerateReport("outstandingSubscriptions", reportData);
            return File(file, "application/pdf", $"outstandingSubscriptions-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }

        [HttpGet("topSubscriptions/{subscriptionAmount}", Name = "TopSubscriptionsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> TopSubscriptionsReport(int subscriptionAmount)
        {
            var reportData = await mediator.Send(new GetTopShareholderSubscriptionBasedReportDataQuery
            {
                topSubscription = subscriptionAmount,

            });

            var file = await GenerateReport("topSubscriptions", reportData);
            return File(file, "application/pdf", $"topSubscriptions-report.pdf");
        }


        [HttpGet("bankAllocations", Name = "BankAllocationsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> BankAllocationsReport([FromQuery] DateRangeDto dateRange)
        {
            var reportData = await mediator.Send(new GetBankAllocationsReportDataQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate,

            });

            var file = await GenerateReport("bankAllocations", reportData);
            return File(file, "application/pdf", $"bankAllocations-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }

        [HttpGet("branchPayment", Name = "BranchPaymentReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> BranchPaymentReport([FromQuery] DateRangeDto dateRange, int BusinessUnit)
        {
            var reportData = await mediator.Send(new GetBranchPaymentReportDataQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate,
                BusinessUnit = BusinessUnit
            });

            var file = await GenerateReport("branchPayment", reportData);
            return File(file, "application/pdf", $"branchPayment-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }

        [HttpGet("branchPaymentSummary", Name = "BranchPaymentSummaryReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> BranchPaymentSummaryReport([FromQuery] DateRangeDto dateRange, int BusinessUnit)
        {
            var reportData = await mediator.Send(new GetBranchGLPaymentsSummaryQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate,
                BusinessUnit = BusinessUnit
            });

            var file = await GenerateReport("branchPaymentSummary", reportData);
            return File(file, "application/pdf", $"branchGLPayment-Summary-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }



        [HttpGet("shareholderAllocations/{id}", Name = "ShareholderAllocationsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ShareholderAllocationsReport(int id)
        {
            var reportData = await mediator.Send(new GetAllShareholderAllocatedSubscriptionReportDataQuery
            {

                ShareholderId = id
            });

            var file = await GenerateReport("shareholderAllocations", reportData);
            return File(file, "application/pdf", $"shareholderAllocations-report.pdf");
        }

        [HttpGet("outstandingAllocations", Name = "OutstandingAllocationsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> OutstandingAllocationsReport([FromQuery] DateRangeDto dateRange)
        {
            var reportData = await mediator.Send(new GetOutstandingShareAllocationReportDataQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate
            });

            var file = await GenerateReport("outstandingAllocations", reportData);
            return File(file, "application/pdf", $"outstandingAllocations-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }

        [HttpGet("premiumCollected", Name = "PremiumCollectedReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> PremiumCollectedReport([FromQuery] DateRangeDto dateRange)
        {
            var reportData = await mediator.Send(new GetPremiumCollectionReportDataQuery
            {
                FromDate = dateRange.FromDate,
                ToDate = dateRange.ToDate,

            });

            var file = await GenerateReport("premiumCollected", reportData);
            return File(file, "application/pdf", $"premiumCollected-report-{dateRange.FromDate}-to-{dateRange.ToDate}.pdf");
        }


        [HttpGet("organizations/{list}", Name = "OrganizationReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> OrganizationReport(string list)
        {
            var reportData = await mediator.Send(new GetOrganizationListReportDataQuery
            {
                organizations = list,

            });

            var file = await GenerateReport("organizations", reportData);
            return File(file, "application/pdf", $"organizations-report.pdf");
        }


        [HttpGet("transfers", Name = "TransfersReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> TransfersReport(DateOnly fromDate, DateOnly toDate)
        {
            var reportData = await mediator.Send(new GetTransfersReportDataQuery
            {
                FromDate = fromDate,
                ToDate = toDate
            });

            var file = await GenerateReport("transfers", reportData);
            return File(file, "application/pdf", $"transfers-report{fromDate}-{toDate}.pdf");
        }
        [HttpGet("paidupbalance", Name = "PaidUpBalanceReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> PaidUpBalanceReport(DateTime Todate)
        {
            var reportData = await mediator.Send(new GetPaidupBalanceReportDataQuery { ToDate = Todate });

            var file = await GenerateReport("paidupbalance", reportData);

            return File(file, "application/pdf", $"paidupbalance{Todate}.pdf");
        }
        [HttpGet("top-shareholders-bypaidup", Name = "TopShareholderByPaidUpReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> TopShareholderByPaidUpReport(int count)
        {
            var reportData = await mediator.Send(new GetTopShareholderByPaidupCapitalReportDataQuery { Count = count });


            var file = await GenerateReport("top-shareholders-bypaidup", reportData);
            return File(file, "application/pdf", $"Top-{count}-shareholder-by-paidup-report.pdf");
        }
        [HttpGet("fractional_paidup_capital", Name = "ListofFractionalPaidUpAmountsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ListofFractionalPaidUpAmountsReport()
        {
            var reportData = await mediator.Send(new GetListofFractionalPaidupAmountDataQuery());


            var file = await GenerateReport("fractional_paidup_capital", reportData);
            return File(file, "application/pdf", $"List-of-fractional-paidup-capital-report.pdf");
        }
        [HttpGet("addtional_share_payments", Name = "ListofAddtionalSharePaymentsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ListofAddtionalSharePaymentsReport(DateTime fromDate, DateTime toDate, ShareholderStatusEnum ShareholderStatusEnum)
        {
            var reportData = await mediator.Send(new GetAddtionalSharePaymentsCollectedDataQuery
            {
                FromDate = fromDate,
                ToDate = toDate,
                ShareholderStatusEnum = ShareholderStatusEnum
            });


            var file = await GenerateReport("addtional_share_payments", reportData);
            return File(file, "application/pdf", $"List-of-addtional-share-payments-from{fromDate}-to{toDate}-report.pdf");
        }
        [HttpGet("foreign_national_shareholders", Name = "ListOfForeignNationalShareholdersReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ListOfForeignNationalShareholdersReport()
        {
            var reportData = await mediator.Send(new GetForeignNationalShareholdersReportDataQuery
            {

            });


            var file = await GenerateReport("foreign_national_shareholders", reportData);
            return File(file, "application/pdf", $"foreign_national_shareholders-report.pdf");
        }
        [HttpGet("active_shareholders", Name = "ListOfActiveShareholdersReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ListOfActiveShareholdersReport(DateTime fromDate, DateTime toDate, ShareholderStatusEnum ShareholderStatusEnum)
        {
            var reportData = await mediator.Send(new GetActiveShareholdersReportDataQuery
            {
                FromDate = fromDate,
                ToDate = toDate,
                ShareholderStatusEnum = ShareholderStatusEnum
            }
            );


            var file = await GenerateReport("active_shareholders", reportData);
            return File(file, "application/pdf", $"active_shareholders-report.pdf");
        }
        [HttpGet("new_shareholders", Name = "ListOfNewShareholdersReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ListOfNewShareholdersReport(DateTime fromDate, DateTime toDate)
        {
            var reportData = await mediator.Send(new GetNewShareholdersReportDataQuery
            {
                FromDate = fromDate,
                ToDate = toDate,
            }
            );
            var file = await GenerateReport("new_shareholders", reportData);
            return File(file, "application/pdf", $"new_shareholders-report.pdf");
        }

        [HttpGet("NewPayments-Impacting-PaidUpGL", Name = "ListofNewPaymentsImpactingPaidUpGLReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ListofNewPaymentsImpactingPaidUpGLReport(DateTime fromDate, DateTime toDate, ShareholderStatusEnum ShareholderStatusEnum, int branchId)
        {
            var reportData = await mediator.Send(new GetNewPaymentsImpactingPaidUpGLQuery
            {
                FromDate = fromDate,
                ToDate = toDate,
                ShareholderStatusEnum = ShareholderStatusEnum,
                BranchId = branchId,
            });
            var file = await GenerateReport("newPayments_impacting_paidUpGL", reportData);
            return File(file, "application/pdf", $"List-of-NewPayments-Impacting-PaidUpGL-from{fromDate}-to{toDate}-report.pdf");
        }

        [HttpGet("NewPayments-Impacting-PaidUpGLSummary", Name = "ListofNewBranchPaymentsSummaryReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> ListofNewBranchPaymentsSummaryReport(DateTime fromDate, DateTime toDate, ShareholderStatusEnum ShareholderStatusEnum, int branchId)
        {
            var reportData = await mediator.Send(new GetBranchSharePaymentsSummaryQuery
            {
                FromDate = fromDate,
                ToDate = toDate,
                ShareholderStatusEnum = ShareholderStatusEnum,
                BranchId = branchId,
            });
            var file = await GenerateReport("newPayments-Impacting-PaidUpGLSummary", reportData);
            return File(file, "application/pdf", $"List-of-NewPayments-SummaryPerBranch-from{fromDate}-to{toDate}-report.pdf");
        }



        [HttpGet("dividend_Decision", Name = "DividendDecisionsReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> DividendDecisionsReport(DateOnly fromDate, DateOnly toDate)
        {
            var reportData = await mediator.Send(new GetDividendDecisionReportDataQuery
            {
                FromDate = fromDate,
                ToDate = toDate,
            }
            );
            var file = await GenerateReport("dividend_Decision", reportData);
            return File(file, "application/pdf", $"dividend-decision-report.pdf");
        }

        [HttpGet("Shareholder_Dividend_Decision", Name = "shareholderDividendDecisionReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> shareholderDividendDecisionReport(int Id)
        {
            var reportData = await mediator.Send(new GetShareholderDividendDecisionReportDataQuery
            {
                shareholderId = Id,
            }
            );
            var file = await GenerateReport("Shareholder_Dividend_Decision", reportData);
            return File(file, "application/pdf", $"shareholder-dividend-decision-report.pdf");
        }

        [HttpGet("Uncollected_Dividend", Name = "uncollectedDividendReport")]
        [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
        public async Task<FileResult> uncollectedDividendReport(int Id)
        {
            var reportData = await mediator.Send(new GetUncollectedDividendReportDataQuery
            {
                Shareholderid = Id,
            }
            );
            var file = await GenerateReport("uncollected_dividend", reportData);
            return File(file, "application/pdf", $"uncollected-dividend-report.pdf");
        }

        private async Task<byte[]> GenerateReport<T>(string path, T reportData)
        {
            try
            {
                var httpClient = factory.CreateClient();
                var jsonRequest = JsonSerializer.Serialize(reportData);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
                var response = await httpClient.PostAsync($"{reportServerBaseUrl}/{path}", content);

                if (!response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadAsStringAsync();
                    var contentMessage = string.IsNullOrWhiteSpace(data) ? string.Empty : $"Error: {data}";
                    throw new HttpRequestException(
                        string.Format(
                            System.Globalization.CultureInfo.InvariantCulture,
                            "Failed to generate report. Status: {0} ({1}).{2}  ",
                            (int)response.StatusCode,
                            response.ReasonPhrase,
                            contentMessage)
                        );
                }

                return await response.Content.ReadAsByteArrayAsync();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}