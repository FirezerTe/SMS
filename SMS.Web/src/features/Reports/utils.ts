export enum ReportType {
  DividendPayments = "DividendPayments",
  Subscriptions = "Subscriptions",
  Transfers = "Transfers",
  ShareholderPayments = "ShareholderPayments",
  Paidupbalance = "PaidupBalance",
  TopShareholderByPaidUP = "TopShareholdersByPaidUp",
  FractionalPaidup = "FractionalPaidupCapital",
  AddtionalSharePayment = "AddtionalSharePayment",
  ForeignNationalShareholders = "ForeignNationalShareholders",
  ActiveShareholders = "ActiveShareholders",
  NewShareholders = "NewShareholders",
  OutstandingSubscriptions = "OutstandingSubscriptions",
  ExpiredSubscriptions = "ExpiredSubscriptions",
  TopSubscriptions = "TopSubscriptions",
  BankAllocations = "BankAllocations",
  ShareholderAllocatedSubscriptions = "ShareholderAllocatedSubscriptions",
  OutstandingAllocations = "OutstandingAllocations",
  PremiumCollection = "PremiumCollction",
  Organizations = "Organizations",
  DividendDecisions = "dividend_Decision",
  shareholderDividendDecision = "shareholderDividendDecision",
  BranchGLPayments = "BranchGLPayments",
  BranchPaymentSummary = "BranchPaymentSummary",
  uncollectedDividend = "uncollectedDividend",
  EndOfDaydaily = "EndOfDaydaily",
  ActiveShareholderListForGA = "ActiveShareholderListForGA",
  NewPaymentsImpactingPaidUpGL = "newPaymentsImpactingPaidUpGL",
  ListofNewBranchPaymentsSummary = "ListofNewBranchPaymentsSummary",
}

export interface ReportComponentProps {
  onReportParamsValidation: (valid: boolean) => void;
  onDownloadComplete: () => void;
  onError: (error: any) => void;
  onDownloadStart: () => void;
}

export interface ReportComponentRef {
  submit: () => void;
}

export const reportsList: {
  type: ReportType;
  name: string;
  isIndividual: boolean;
}[] = [
  {
    type: ReportType.DividendPayments,
    name: "Dividend Payments",
    isIndividual: false,
  },
  {
    type: ReportType.Subscriptions,
    name: "Subscriptions",
    isIndividual: false,
  },
  {
    type: ReportType.OutstandingSubscriptions,
    name: "Outstanding Subscriptions",
    isIndividual: false,
  },
  {
    type: ReportType.ExpiredSubscriptions,
    name: "Expired Subscriptions",
    isIndividual: false,
  },
  {
    type: ReportType.TopSubscriptions,
    name: "Top shareholder List based on subscription",
    isIndividual: false,
  },
  {
    type: ReportType.BankAllocations,
    name: "Bank Allocations",
    isIndividual: false,
  },
  {
    type: ReportType.ShareholderAllocatedSubscriptions,
    name: "Shareholder Allocated Subscriptions",
    isIndividual: false,
  },
  {
    type: ReportType.OutstandingAllocations,
    name: "Outstanding Allocations",
    isIndividual: false,
  },
  {
    type: ReportType.PremiumCollection,
    name: "Premium Collection",
    isIndividual: false,
  },
  {
    type: ReportType.Transfers,
    name: "Transfers",
    isIndividual: false,
  },
  {
    type: ReportType.Organizations,
    name: "Organization List Report",
    isIndividual: false,
  },
  {
    type: ReportType.ShareholderPayments,
    name: "Shareholder Payments",
    isIndividual: true,
  },
  {
    type: ReportType.Paidupbalance,
    name: "PaidUp Balance",
    isIndividual: false,
  },
  {
    type: ReportType.TopShareholderByPaidUP,
    name: "Top Shareholders ByPaidup Capital",
    isIndividual: false,
  },
  {
    type: ReportType.FractionalPaidup,
    name: "Fractional Paidup Capital",
    isIndividual: false,
  },
  {
    type: ReportType.AddtionalSharePayment,
    name: "Additional Share Payments",
    isIndividual: false,
  },
  {
    type: ReportType.NewPaymentsImpactingPaidUpGL,
    name: "New Payments Impacting Paid Up GL",
    isIndividual: false,
  },
  
  {
    type: ReportType.ListofNewBranchPaymentsSummary,
    name: "New Payments Summary Per Branch",
    isIndividual: false,
  },
  {
    type: ReportType.ForeignNationalShareholders,
    name: "Foreign National Shareholders",
    isIndividual: false,
  },
  {
    type: ReportType.ActiveShareholders,
    name: "Active Shareholders",
    isIndividual: false,
  },
  {
    type: ReportType.NewShareholders,
    name: "New Shareholders",
    isIndividual: false,
  },
  {
    type: ReportType.DividendDecisions,
    name: "Dividend Decisions",
    isIndividual: false,
  },
  {
    type: ReportType.shareholderDividendDecision,
    name: "Shareholder Dividend Decision",
    isIndividual: false,
  },
  {
    type: ReportType.BranchGLPayments,
    name: "Branch GL Payments",
    isIndividual: false,
  },
  {
    type: ReportType.BranchPaymentSummary,
    name: "Branch GL Payments Summary Per Branch",
    isIndividual: false,
  },
  {
    type: ReportType.uncollectedDividend,
    name: "uncollectedDividend",
    isIndividual: false,
  },
  {
    type: ReportType.EndOfDaydaily,
    name: "End Of Day Report",
    isIndividual: false,
  },
  {
    type: ReportType.ActiveShareholderListForGA,
    name: "Active Shareholder List For GA",
    isIndividual: false,
  },
];