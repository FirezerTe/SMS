import { Request } from "express";
import { Report } from "./types";
import { getShareCertificate } from "./shareCertificate/shareCertificate";
import { getShareholderPaymentsReport } from "./shareholderPaymentsReport";
import { getDividendPaymentsReport } from "./dividendPaymentsReport";
import { getTransfersReport } from "./transfersReport";
import { getSubscriptionsReport } from "./subscriptionsReport";
import { getPaidupBalanceReport } from "./paidupCapitalBalanceReport";
import { getTopShareholderByPaidupCapitalReport } from "./TopshareholderByPaidupReport";
import { getListOfFractionalPaidup } from "./ListofFractionalPaidupCapitalReport";
import { getListOfAddtionalSharePayments } from "./ListofAddtionalSharePaymentsReport";
import { getForeignNationalShareholderReport } from "./ForeignNationalShareholdersReport";
import { getActiveShareholderReport } from "./ActiveShareholdersReport";
import { getNewShareholderReport } from "./NewShareholdersReport";
import { getOutstandingSubscriptionsReport } from "./outstandingSubscriptionsReport";
import { getExpiredSubscriptionsReport } from "./expiredSubscriptionsReport";
import { getTopSubscriptionsReport } from "./topSubscriptionsReport";
import { getBankAllocations } from "./bankAllocationsReport";
import { getShareholdersAllocatedSubscriptions } from "./shareholderAllocatedSubscriptionsReport";
import { getOutstandingAllocationsReport } from "./outstandingAllocationsReport";
import { getPremiumCollectionReport } from "./premiumCollectedReport";
import { getOrganization } from "./organizationReport";
import { getNewPaymentsImpactingPaidUpGL } from "./NewPaymentsImpactingPaidUpGLReport";
import { getBranchSharePaymentsSummary } from "./NewBranchPaymentsSummaryReport";
import { getShareholderDividendDecisionReport } from "./shareholderDividendDecisionReport";
import { getUncollectedDividendReport } from "./uncollectedDividendReport";
import { getDividendDecisionReport } from "./DividendDecisionsReport";
import { getActiveShareholderListForGAs } from "./ActiveListOfShareholder";
import { getEndOfDayDaily } from "./endOfDayDailyReport";
import { getBranchGLPaymentReport } from "./branchGLPayments";
import { getBranchGLPaymentSummaryReport } from "./branchGLPaymentsSummaryReport";

interface Metadata {
  title: string;
  handler: (request: Request) => JSX.Element;
}
export const reportConfigurations: { [key in Report]: Metadata } = {
  [Report.ShareCertificate]: {
    title: "Shareholder Certificate",
    handler: getShareCertificate,
  },
  [Report.ShareholderPayments]: {
    title: "Payments Report",
    handler: getShareholderPaymentsReport,
  },
  [Report.BranchGLPayments]: {
    title: "Branch GL Payments",
    handler: getBranchGLPaymentReport,
  },
  [Report.BranchGLPaymentsSummary]: {
    title: "Branch GL Payments Summary",
    handler: getBranchGLPaymentSummaryReport,
  },
  [Report.DividendPayments]: {
    title: "Dividend Payments Report",
    handler: getDividendPaymentsReport,
  },
  [Report.Subscriptions]: {
    title: "Subscriptions Report",
    handler: getSubscriptionsReport,
  },
  [Report.OutstandingSubscriptions]: {
    title: "Outstanding Subscriptions Report",
    handler: getOutstandingSubscriptionsReport,
  },
  [Report.ExpiredSubscriptions]: {
    title: "Expired Subscriptions Report",
    handler: getExpiredSubscriptionsReport,
  },
  [Report.TopSubscriptions]: {
    title: "Top Shareholder based on Subscriptions Report",
    handler: getTopSubscriptionsReport,
  },
  [Report.BankAllocations]: {
    title: "Bank Allocations Report",
    handler: getBankAllocations,
  },
  [Report.ShareholdersAllocatedSubscriptions]: {
    title: "Allocated Subscriptions Report",
    handler: getShareholdersAllocatedSubscriptions,
  },
  [Report.OutstandingAllocations]: {
    title: "Outstanding Allocations Report",
    handler: getOutstandingAllocationsReport,
  },
  [Report.PremiumCollction]: {
    title: "Premium Collection Report",
    handler: getPremiumCollectionReport,
  },
  [Report.Organizations]: {
    title: "Organizations List Report",
    handler: getOrganization,
  },
  [Report.Transfers]: {
    title: "Transfers Report",
    handler: getTransfersReport,
  },
  [Report.PaidupBalance]: {
    title: "PaidUp Balance Report",
    handler: getPaidupBalanceReport,
  },
  [Report.NewPaymentsImpactingPaidUpGLReport]: {
    title: "New Payments Impacting Paidup GL",
    handler: getNewPaymentsImpactingPaidUpGL,
  },
  [Report.NewBranchPaymentsSummary]: {
    title: "New Payments Summary Per Branch",
    handler: getBranchSharePaymentsSummary,
  },
  [Report.TopShareholderByPaidup]: {
    title: "Top Shareholders ByPaidup Report",
    handler: getTopShareholderByPaidupCapitalReport,
  },
  [Report.FractionalPaidupCapital]: {
    title: "List Of Fractional Paidup Capital Report",
    handler: getListOfFractionalPaidup,
  },
  [Report.AddtionalShareReport]: {
    title: "List Of Addtional Share Payments Made",
    handler: getListOfAddtionalSharePayments,
  },
  [Report.ForeignNationalShareholdersReport]: {
    title: "List Of Foreign National Shareholders",
    handler: getForeignNationalShareholderReport,
  },
  [Report.ActiveShareholdersListReport]: {
    title: "Active Shareholders",
    handler: getActiveShareholderReport,
  },
  [Report.NewShareholdersListReport]: {
    title: "New Shareholders",
    handler: getNewShareholderReport,
  },
  [Report.ShareholderDividendDecisionReport]: {
    title: "Dividend Decision per Shareholder",
    handler: getShareholderDividendDecisionReport,
  },
  [Report.DividendDecisionsReport]: {
    title: "Dividend Decisions",
    handler: getDividendDecisionReport,
  },
  [Report.UncollectedDividendReport]: {
    title: "Uncollected Dividend List",
    handler: getUncollectedDividendReport,
  },  
  [Report.ActiveListOfShareholder]: {
    title: "Active Shareholder List for General",
    handler: getActiveShareholderListForGAs,
  },
  [Report.EndOfDaydaily]: {
    title: "Daily Eod Posting Report",
    handler: getEndOfDayDaily,
  }
};