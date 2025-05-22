import { handleFileDownload } from "../../../utils/handleFileDownload";
import { SMSApi } from "../SMSApi";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: ["Report"],
  endpoints: {
    dividendPaymentsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/dividend-payments`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `dividend-payments-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    subscriptionsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/subscriptions/${queryArg.id}`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `subscriptions-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    outstandingSubscriptionsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/outstandingSubscriptions`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `outstandingSubscriptions-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    endOfDayDailyReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/endOfDayDaily`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `End-Of-Day-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    expiredSubscriptionsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/expiredSubscriptions/${queryArg.id}`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `Expiredsubscriptions-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    topSubscriptionsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/topSubscriptions/${queryArg.subscriptionAmount}`,
          params: { subscriptionAmount: queryArg.subscriptionAmount },
          responseHandler: handleFileDownload(
            `Top-Subscriptions-report-${queryArg.subscriptionAmount}.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    bankAllocationsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/bankAllocations`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `bank-Allocations-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    shareholderAllocationsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/shareholderAllocations/${queryArg.id}`,
          responseHandler: handleFileDownload(
            `shareholderAllocations-report.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    outstandingAllocationsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/outstandingAllocations`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `Outstanding-Allocations-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    premiumCollectedReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/premiumCollected`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `premium-Collected-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    organizationReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/organizations/${queryArg.list}`,
          params: { list: queryArg.list },
          responseHandler: handleFileDownload(
            `Organization-List-report-${queryArg.list}.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    transfersReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/transfers`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `transfers-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    shareholderPaymentsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/shareholder-payments/${queryArg.id}`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `shareholder-payments-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    shareCertificateReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/share-certificate/${queryArg.id}`,
          params: { certificateId: queryArg.certificateId },
          responseHandler: handleFileDownload(
            `shareholder-certificate-report.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    listofAddtionalSharePaymentsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/addtional_share_payments/`,
          params: {
            fromDate: queryArg.fromDate,
            toDate: queryArg.toDate,
            shareholderStatusEnum: queryArg.shareholderStatusEnum,
          },
          responseHandler: handleFileDownload(
            `addtional_share_payments-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    listOfActiveShareholdersReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/active_shareholders/`,
          params: {
            fromDate: queryArg.fromDate,
            toDate: queryArg.toDate,
            shareholderStatusEnum: queryArg.shareholderStatusEnum,
          },
          responseHandler: handleFileDownload(
            `active-${
              queryArg.shareholderStatusEnum || ""
            }-shareholders-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    listOfNewShareholdersReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/new_shareholders/`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `new-shareholders-report-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    paidUpBalanceReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/paidupbalance`,
          params: { todate: queryArg.todate },
          responseHandler: handleFileDownload(
            `paidupbalance-${queryArg.todate || ""}.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    topShareholderByPaidUpReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/top-shareholders-bypaidup`,
          params: { count: queryArg.count },
          responseHandler: handleFileDownload(
            `top-${queryArg.count || ""}-shareholders-bypaidup.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    listofFractionalPaidUpAmountsReport: {
      query: () => {
        return {
          url: `/api/Reports/fractional_paidup_capital`,
          //params: { count: queryArg.count },
          responseHandler: handleFileDownload(`fractional_paidup_capital.pdf`),
          cache: "no-cache",
        };
      },
    },
    listOfForeignNationalShareholdersReport: {
      query: () => {
        return {
          url: `/api/Reports/foreign_national_shareholders`,
          //params: { count: queryArg.count },
          responseHandler: handleFileDownload(
            `Foreign-National-Shareholders.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    listofNewPaymentsImpactingPaidUpGlReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/NewPayments-Impacting-PaidUpGL/`,
          params: {
            fromDate: queryArg.fromDate,
            toDate: queryArg.toDate,
            shareholderStatusEnum: queryArg.shareholderStatusEnum,
            branchId: queryArg.branchId
          },
          responseHandler: handleFileDownload(
            `List-of-NewPayments-Impacting-PaidUpGL-from-${
              queryArg.fromDate || ""
            }-to-${queryArg.toDate || ""}.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    listofNewBranchPaymentsSummaryReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/newPayments-Impacting-PaidUpGLSummary/`,
          params: {
            fromDate: queryArg.fromDate,
            toDate: queryArg.toDate,
            shareholderStatusEnum: queryArg.shareholderStatusEnum,
            branchId: queryArg.branchId
          },
          responseHandler: handleFileDownload(
            `List-of-NewPayments-Impacting-PaidUpGL-from-${
              queryArg.fromDate || ""
            }-to-${queryArg.toDate || ""}.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    
    branchPaymentReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/branchPayment`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate , businessUnit: queryArg.businessUnit},
          responseHandler: handleFileDownload(
            `Branch-Payments-on-GL-From-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
   
    branchPaymentSummaryReport: {
      query: (queryArg: { fromDate: any; toDate: any; businessUnit: any; }) => {
        return {
          url: `/api/Reports/branchPaymentSummary`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate , businessUnit: queryArg.businessUnit},
          responseHandler: handleFileDownload(
            `Branch-Payments-on-GL-From-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },

    dividendDecisionsReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/dividend_Decision`,
          params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
          responseHandler: handleFileDownload(
            `dividend_Decision-From-${queryArg.fromDate || ""}-to-${
              queryArg.toDate || ""
            }.pdf`
          ),
          cache: "no-cache",
        };
      },
    },
    shareholderDividendDecisionReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/Shareholder_Dividend_Decision`,
          params: { id: queryArg.id },
          responseHandler: handleFileDownload(
            `shareholderDividendDecisionReport.pdf`
          ),
          cache: "no-cache",
        };
      },
    },

    uncollectedDividendReport: {
      query: (queryArg) => {
        return {
          url: `/api/Reports/Uncollected_Dividend`,
          params: { id: queryArg.id },
          responseHandler: handleFileDownload(`uncollectedDividendReport.pdf`),
          cache: "no-cache",
        };
      },
    },
  },
});

export default enhancedApi;