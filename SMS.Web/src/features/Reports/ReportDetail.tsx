import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useMemo
} from "react";
import { ActiveShareholderListForGAReport } from "./ActiveShareholderListForGA";
import { ActiveShareholdersListReport } from "./ActiveShareholdersReport";
import { AdditionalSharePaymentListReport } from "./AddtionalSharePaymentsReport";
import { BankAllocationsReport } from "./BankAllocationsReport";
import { BranchPaymentSummaryReport } from "./BranchGLPaymentSummaryReport";
import { BranchPaymentsGLReport } from "./BranchPaymentsGLReport";
import { DividendDecisionsReport } from "./DividendDecisionsReport";
import { DividendPaymentsReport } from "./DividendPaymentsReport";
import { EndOfDayDailyReport } from "./EndOfDayDailyReport";
import { ExpiredSubscriptionsReport } from "./ExpiredSubscriptionReport";
import { ForeignNationalShareholdersListReport } from "./ForeignNationalShareholdersReport";
import { FractionalPaidupReport } from "./FractionalPaidupCapitalReport";
import { NewPaymentsImpactingPaidUpGLReport } from "./NewPaymentsImpactingPaidUpGLReport";
import { BranchSharePaymentsSummaryReport } from "./NewPaymentsImpactingPaidUpGLSummaryReport";
import { NewShareholdersListReport } from "./NewShareholdersReport";
import { OrganizationListReport } from "./OrganizationListReport";
import { OutstandingAllocationsReport } from "./OutstandingAllocationsReport";
import { OutstandingSubscriptionsReport } from "./OutstandingSubscriptionsReport";
import { PaidupBalanceReport } from "./PaidUpBalanceReport";
import { PremiumCollectionReport } from "./PremiumCollectionReport";
import { ShareholderDividendDecisionReport } from "./ShareholderDividendDecisionReport";
import { ShareholderPaymentsReport } from "./ShareholderPaymentsReport";
import { ShareholderAllocatedSubscriptionsReport } from "./ShareholdersAllocatedSubscriptionsReport";
import { SubscriptionsReport } from "./SubscriptionsReport";
import { TopshareholderByPaidupCapitalReport } from "./TopshareholderByPaidupReport";
import { TopSubscriptionsReport } from "./TopShareholderSubscription";
import { TransfersReport } from "./TransfersReport";
import { UncollectedDividends } from "./UncollectedDividendsReport";
import { ReportComponentProps, ReportComponentRef, ReportType } from "./utils";

const reportComponents: {
  [key in ReportType]: ForwardRefExoticComponent<
    ReportComponentProps & RefAttributes<{ submit: () => void }>
  >;
} = {
  [ReportType.DividendPayments]: DividendPaymentsReport,
  [ReportType.Subscriptions]: SubscriptionsReport,
  [ReportType.Transfers]: TransfersReport,
  [ReportType.ShareholderPayments]: ShareholderPaymentsReport,
  [ReportType.Paidupbalance]: PaidupBalanceReport,
  [ReportType.TopShareholderByPaidUP]: TopshareholderByPaidupCapitalReport,
  [ReportType.FractionalPaidup]: FractionalPaidupReport,
  [ReportType.AddtionalSharePayment]: AdditionalSharePaymentListReport,
  [ReportType.ForeignNationalShareholders]:
    ForeignNationalShareholdersListReport,
  [ReportType.ActiveShareholders]: ActiveShareholdersListReport,
  [ReportType.NewShareholders]: NewShareholdersListReport,
  [ReportType.OutstandingSubscriptions]: OutstandingSubscriptionsReport,
  [ReportType.ExpiredSubscriptions]: ExpiredSubscriptionsReport,
  [ReportType.TopSubscriptions]: TopSubscriptionsReport,
  [ReportType.BankAllocations]: BankAllocationsReport,
  [ReportType.ShareholderAllocatedSubscriptions]:
    ShareholderAllocatedSubscriptionsReport,
  [ReportType.PremiumCollection]: PremiumCollectionReport,
  [ReportType.NewPaymentsImpactingPaidUpGL]: NewPaymentsImpactingPaidUpGLReport,
  [ReportType.ListofNewBranchPaymentsSummary]: BranchSharePaymentsSummaryReport,
  [ReportType.OutstandingAllocations]: OutstandingAllocationsReport,
  [ReportType.Organizations]: OrganizationListReport,
  [ReportType.DividendDecisions]: DividendDecisionsReport,
  [ReportType.shareholderDividendDecision]: ShareholderDividendDecisionReport,
  [ReportType.BranchGLPayments]: BranchPaymentsGLReport,
  [ReportType.BranchPaymentSummary]: BranchPaymentSummaryReport,
  [ReportType.uncollectedDividend]: UncollectedDividends,
  [ReportType.EndOfDaydaily]: EndOfDayDailyReport,
  [ReportType.ActiveShareholderListForGA]: ActiveShareholderListForGAReport,
};

export const ReportDetail = forwardRef<
  ReportComponentRef,
  ReportComponentProps & {
    report: ReportType;
  }
>(
  (
    {
      report,
      onReportParamsValidation,
      onDownloadComplete,
      onError,
      onDownloadStart,
    },
    ref
  ) => {
    const Component = useMemo(() => reportComponents[report], [report]);

    const onError_ = useCallback(
      (error: any) => {
        if (error?.status !== 500) {
          onError(error);
        }
      },
      [onError]
    );

    return Component ? (
      <Component
        onDownloadComplete={onDownloadComplete}
        onReportParamsValidation={onReportParamsValidation}
        onError={onError_}
        onDownloadStart={onDownloadStart}
        ref={ref}
      />
    ) : null;
  }
);