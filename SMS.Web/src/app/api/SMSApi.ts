import { emptySplitApi as api } from "./emptySplitApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    activateUser: build.mutation<ActivateUserApiResponse, ActivateUserApiArg>({
      query: (queryArg) => ({
        url: `/api/Account/activate-user`,
        method: "POST",
        body: queryArg.userEmail,
      }),
    }),
    changePassword: build.mutation<
      ChangePasswordApiResponse,
      ChangePasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Account/change-password`,
        method: "POST",
        body: queryArg.changePasswordPayload,
      }),
    }),
    deactivateUser: build.mutation<
      DeactivateUserApiResponse,
      DeactivateUserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Account/deactivate-user`,
        method: "POST",
        body: queryArg.userEmail,
      }),
    }),
    forgotPassword: build.mutation<
      ForgotPasswordApiResponse,
      ForgotPasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Account/forgot-password`,
        method: "POST",
        body: queryArg.forgotPasswordPayload,
      }),
    }),
    login: build.mutation<LoginApiResponse, LoginApiArg>({
      query: (queryArg) => ({
        url: `/api/Account/login`,
        method: "POST",
        body: queryArg.loginDto,
        params: { returnUrl: queryArg.returnUrl },
      }),
    }),
    logout: build.mutation<LogoutApiResponse, LogoutApiArg>({
      query: () => ({ url: `/api/Account/logout`, method: "POST" }),
    }),
    resetPassword: build.mutation<
      ResetPasswordApiResponse,
      ResetPasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Account/reset-password`,
        method: "POST",
        body: queryArg.resetPasswordPayload,
      }),
    }),
    verificationCode: build.mutation<
      VerificationCodeApiResponse,
      VerificationCodeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Account/verification-code`,
        method: "POST",
        body: queryArg.verificationCode,
      }),
    }),
    registerUser: build.mutation<RegisterUserApiResponse, RegisterUserApiArg>({
      query: (queryArg) => ({
        url: `/api/Admin/register-user`,
        method: "POST",
        body: queryArg.registerDto,
      }),
    }),
    getRoles: build.query<GetRolesApiResponse, GetRolesApiArg>({
      query: () => ({ url: `/api/Admin/roles` }),
    }),
    addClaims: build.mutation<AddClaimsApiResponse, AddClaimsApiArg>({
      query: (queryArg) => ({
        url: `/api/Admin/user/add-claims`,
        method: "POST",
        body: queryArg.body,
        params: { userId: queryArg.userId },
      }),
    }),
    users: build.query<UsersApiResponse, UsersApiArg>({
      query: () => ({ url: `/api/Admin/users` }),
    }),
    getUserDetail: build.query<GetUserDetailApiResponse, GetUserDetailApiArg>({
      query: (queryArg) => ({
        url: `/api/Admin/users/:id`,
        params: { id: queryArg.id },
      }),
    }),
    addUserRole: build.mutation<AddUserRoleApiResponse, AddUserRoleApiArg>({
      query: (queryArg) => ({
        url: `/api/Admin/users/:id/:role`,
        method: "POST",
        params: { id: queryArg.id, role: queryArg.role },
      }),
    }),
    removeUserRole: build.mutation<
      RemoveUserRoleApiResponse,
      RemoveUserRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Admin/users/:id/:role`,
        method: "DELETE",
        params: { id: queryArg.id, role: queryArg.role },
      }),
    }),
    getAllAllocations: build.query<
      GetAllAllocationsApiResponse,
      GetAllAllocationsApiArg
    >({
      query: () => ({ url: `/api/Allocations/all` }),
    }),
    approveAllocation: build.mutation<
      ApproveAllocationApiResponse,
      ApproveAllocationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/approve`,
        method: "POST",
        body: queryArg.approveAllocationCommand,
      }),
    }),
    getAllBankAllocations: build.query<
      GetAllBankAllocationsApiResponse,
      GetAllBankAllocationsApiArg
    >({
      query: () => ({
        url: `/api/Allocations/bank-allocation/all-allocations`,
      }),
    }),
    approveBankAllocation: build.mutation<
      ApproveBankAllocationApiResponse,
      ApproveBankAllocationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/bank-allocation/approve`,
        method: "POST",
        body: queryArg.approveBankAllocationCommand,
      }),
    }),
    rejectBankAllocation: build.mutation<
      RejectBankAllocationApiResponse,
      RejectBankAllocationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/bank-allocation/reject`,
        method: "POST",
        body: queryArg.rejectBankAllocationCommand,
      }),
    }),
    setBankAllocation: build.mutation<
      SetBankAllocationApiResponse,
      SetBankAllocationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/bank-allocation/set`,
        method: "POST",
        body: queryArg.setBankAllocationCommand,
      }),
    }),
    submitBankAllocationForApproval: build.mutation<
      SubmitBankAllocationForApprovalApiResponse,
      SubmitBankAllocationForApprovalApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/bank-allocation/submit-for-approval`,
        method: "POST",
        body: queryArg.submitBankAllocationApprovalRequestCommand,
      }),
    }),
    createAllocation: build.mutation<
      CreateAllocationApiResponse,
      CreateAllocationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/create`,
        method: "POST",
        body: queryArg.createAllocationCommand,
      }),
    }),
    rejectAllocation: build.mutation<
      RejectAllocationApiResponse,
      RejectAllocationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/reject`,
        method: "POST",
        body: queryArg.rejectAllocationCommand,
      }),
    }),
    getAllShareholderAllocations: build.query<
      GetAllShareholderAllocationsApiResponse,
      GetAllShareholderAllocationsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/shareholder/${queryArg.shareholderId}/allocations`,
      }),
    }),
    submitAllocationForApproval: build.mutation<
      SubmitAllocationForApprovalApiResponse,
      SubmitAllocationForApprovalApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/submit-for-approval`,
        method: "POST",
        body: queryArg.submitAllocationApprovalRequestCommand,
      }),
    }),
    getAllocationSummaries: build.query<
      GetAllocationSummariesApiResponse,
      GetAllocationSummariesApiArg
    >({
      query: () => ({ url: `/api/Allocations/summaries` }),
    }),
    updateAllocation: build.mutation<
      UpdateAllocationApiResponse,
      UpdateAllocationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Allocations/update`,
        method: "PUT",
        body: queryArg.updateAllocationCommand,
      }),
    }),
    getShareholderCertificates: build.query<
      GetShareholderCertificatesApiResponse,
      GetShareholderCertificatesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Certificate/${queryArg.id}/certficates`,
      }),
    }),
    activateCertificate: build.mutation<
      ActivateCertificateApiResponse,
      ActivateCertificateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Certificate/activate-certificate`,
        method: "POST",
        body: queryArg.certificateDto,
      }),
    }),
    uploadCertificateIssueDocument: build.mutation<
      UploadCertificateIssueDocumentApiResponse,
      UploadCertificateIssueDocumentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Certificate/certificate-detail/${queryArg.id}/document`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    deactivateCertificate: build.mutation<
      DeactivateCertificateApiResponse,
      DeactivateCertificateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Certificate/deactivate-certificate`,
        method: "POST",
        body: queryArg.certificateDto,
      }),
    }),
    prepareShareholderCertificate: build.mutation<
      PrepareShareholderCertificateApiResponse,
      PrepareShareholderCertificateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Certificate/prepare`,
        method: "POST",
        body: queryArg.prepareShareholderCertificateCommand,
      }),
    }),
    updateShareholderCertificate: build.mutation<
      UpdateShareholderCertificateApiResponse,
      UpdateShareholderCertificateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Certificate/update`,
        method: "POST",
        body: queryArg.updateShareholderCertificateCommand,
      }),
    }),
    getShareholderDividends: build.query<
      GetShareholderDividendsApiResponse,
      GetShareholderDividendsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/${queryArg.shareholderId}`,
      }),
    }),
    addNewDividendSetup: build.mutation<
      AddNewDividendSetupApiResponse,
      AddNewDividendSetupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/add-dividend-setup`,
        method: "POST",
        body: queryArg.addDividendSetupCommand,
      }),
    }),
    approveDividendSetup: build.mutation<
      ApproveDividendSetupApiResponse,
      ApproveDividendSetupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/approve`,
        method: "POST",
        body: queryArg.approveDividendSetupCommand,
      }),
    }),
    computeDividendRate: build.mutation<
      ComputeDividendRateApiResponse,
      ComputeDividendRateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/compute-dividend-rate`,
        method: "POST",
        body: queryArg.computeDividendRateCommand,
      }),
    }),
    attachDividendDecisionDocument: build.mutation<
      AttachDividendDecisionDocumentApiResponse,
      AttachDividendDecisionDocumentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/decision-attachment/${queryArg.id}`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getDividendDecisionsSummary: build.query<
      GetDividendDecisionsSummaryApiResponse,
      GetDividendDecisionsSummaryApiArg
    >({
      query: () => ({ url: `/api/Dividends/dividend-decisions-summary` }),
    }),
    evaluateDividendDecision: build.mutation<
      EvaluateDividendDecisionApiResponse,
      EvaluateDividendDecisionApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/evaluate-dividend-decision`,
        method: "POST",
        body: queryArg.computeDividendDecisionCommand,
      }),
    }),
    getDividendPeriods: build.query<
      GetDividendPeriodsApiResponse,
      GetDividendPeriodsApiArg
    >({
      query: () => ({ url: `/api/Dividends/periods` }),
    }),
    getSetupDividends: build.query<
      GetSetupDividendsApiResponse,
      GetSetupDividendsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/setup-dividends/${queryArg.setupId}`,
        params: {
          pageNumber: queryArg.pageNumber,
          pageSize: queryArg.pageSize,
        },
      }),
    }),
    getSetups: build.query<GetSetupsApiResponse, GetSetupsApiArg>({
      query: () => ({ url: `/api/Dividends/setups` }),
    }),
    getShareholderDividendDetail: build.query<
      GetShareholderDividendDetailApiResponse,
      GetShareholderDividendDetailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/shareholder-dividend-detail/${queryArg.setupId}/${queryArg.shareholderId}`,
      }),
    }),
    submitDividendDecision: build.mutation<
      SubmitDividendDecisionApiResponse,
      SubmitDividendDecisionApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/submitDividendDecision`,
        method: "POST",
        body: queryArg.saveDividendDecisionCommand,
      }),
    }),
    taxPendingDecisions: build.mutation<
      TaxPendingDecisionsApiResponse,
      TaxPendingDecisionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/tax-pending-decisions`,
        method: "POST",
        body: queryArg.taxPendingDecisionsCommand,
      }),
    }),
    updateDividendSetup: build.mutation<
      UpdateDividendSetupApiResponse,
      UpdateDividendSetupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Dividends/update-dividend-setup`,
        method: "POST",
        body: queryArg.updateDividendSetupCommand,
      }),
    }),
    getApiDocumentsById: build.query<
      GetApiDocumentsByIdApiResponse,
      GetApiDocumentsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/Documents/${queryArg.id}` }),
    }),
    downloadDocument: build.query<
      DownloadDocumentApiResponse,
      DownloadDocumentApiArg
    >({
      query: (queryArg) => ({ url: `/api/Documents/${queryArg.id}/download` }),
    }),
    documentRootPath: build.query<
      DocumentRootPathApiResponse,
      DocumentRootPathApiArg
    >({
      query: () => ({ url: `/api/Documents/root-path` }),
    }),
    exportToCsvFile: build.mutation<
      ExportToCsvFileApiResponse,
      ExportToCsvFileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/EndOfDay/ExportToCsvFile`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getAllTransactions: build.query<
      GetAllTransactionsApiResponse,
      GetAllTransactionsApiArg
    >({
      query: () => ({ url: `/api/EndOfDay/GetAllTransactions` }),
    }),
    getCoreTransaction: build.query<
      GetCoreTransactionApiResponse,
      GetCoreTransactionApiArg
    >({
      query: (queryArg) => ({
        url: `/api/EndOfDay/GetCoreTransaction`,
        params: { transactionDate: queryArg.transactionDate },
      }),
    }),
    getDailyTransactions: build.query<
      GetDailyTransactionsApiResponse,
      GetDailyTransactionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/EndOfDay/GetDailyTransactions`,
        params: {
          transactionDate: queryArg.transactionDate,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
        },
      }),
    }),
    processEod: build.mutation<ProcessEodApiResponse, ProcessEodApiArg>({
      query: (queryArg) => ({
        url: `/api/EndOfDay/ProcessEod`,
        method: "POST",
        body: queryArg.body,
        params: { date: queryArg.date, description: queryArg.description },
      }),
    }),
    getAllLookups: build.query<GetAllLookupsApiResponse, GetAllLookupsApiArg>({
      query: () => ({ url: `/api/Lookups/all` }),
    }),
    approveParValue: build.mutation<
      ApproveParValueApiResponse,
      ApproveParValueApiArg
    >({
      query: (queryArg) => ({
        url: `/api/ParValues/approve`,
        method: "POST",
        body: queryArg.approveParValueCommand,
      }),
    }),
    createParValue: build.mutation<
      CreateParValueApiResponse,
      CreateParValueApiArg
    >({
      query: (queryArg) => ({
        url: `/api/ParValues/CreateParValue`,
        method: "POST",
        body: queryArg.createParValueCommand,
      }),
    }),
    getAllParValues: build.query<
      GetAllParValuesApiResponse,
      GetAllParValuesApiArg
    >({
      query: () => ({ url: `/api/ParValues/parvalues` }),
    }),
    rejectParValue: build.mutation<
      RejectParValueApiResponse,
      RejectParValueApiArg
    >({
      query: (queryArg) => ({
        url: `/api/ParValues/reject`,
        method: "POST",
        body: queryArg.rejectParValueCommand,
      }),
    }),
    submitParValueForApproval: build.mutation<
      SubmitParValueForApprovalApiResponse,
      SubmitParValueForApprovalApiArg
    >({
      query: (queryArg) => ({
        url: `/api/ParValues/submit-for-approval`,
        method: "POST",
        body: queryArg.submitParValueApprovalRequestCommand,
      }),
    }),
    updateParValue: build.mutation<
      UpdateParValueApiResponse,
      UpdateParValueApiArg
    >({
      query: (queryArg) => ({
        url: `/api/ParValues/update`,
        method: "POST",
        body: queryArg.updateParValueCommand,
      }),
    }),
    uploadSubscriptionPaymentReceipt: build.mutation<
      UploadSubscriptionPaymentReceiptApiResponse,
      UploadSubscriptionPaymentReceiptApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Payments/${queryArg.id}/payment-receipt`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    makePayment: build.mutation<MakePaymentApiResponse, MakePaymentApiArg>({
      query: (queryArg) => ({
        url: `/api/Payments/add`,
        method: "POST",
        body: queryArg.makeSubscriptionPaymentCommand,
      }),
    }),
    addNewAdjustment: build.mutation<
      AddNewAdjustmentApiResponse,
      AddNewAdjustmentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Payments/new-adjustment`,
        method: "POST",
        body: queryArg.addPaymentAdjustmentCommand,
      }),
    }),
    getSubscriptionPayments: build.query<
      GetSubscriptionPaymentsApiResponse,
      GetSubscriptionPaymentsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Payments/subscription/${queryArg.id}`,
      }),
    }),
    updatePayment: build.mutation<
      UpdatePaymentApiResponse,
      UpdatePaymentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Payments/update`,
        method: "POST",
        body: queryArg.updateSubscriptionPaymentCommand,
      }),
    }),
    updatePaymentAdjustment: build.mutation<
      UpdatePaymentAdjustmentApiResponse,
      UpdatePaymentAdjustmentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Payments/update-adjustment`,
        method: "POST",
        body: queryArg.updatePaymentAdjustmentCommand,
      }),
    }),
    listOfActiveShareholdersReport: build.query<
      ListOfActiveShareholdersReportApiResponse,
      ListOfActiveShareholdersReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/active_shareholders`,
        params: {
          fromDate: queryArg.fromDate,
          toDate: queryArg.toDate,
          shareholderStatusEnum: queryArg.shareholderStatusEnum,
        },
      }),
    }),
    activeShareholderListForGa: build.query<
      ActiveShareholderListForGaApiResponse,
      ActiveShareholderListForGaApiArg
    >({
      query: () => ({ url: `/api/Reports/activeShareholderListForGA` }),
    }),
    listofAddtionalSharePaymentsReport: build.query<
      ListofAddtionalSharePaymentsReportApiResponse,
      ListofAddtionalSharePaymentsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/addtional_share_payments`,
        params: {
          fromDate: queryArg.fromDate,
          toDate: queryArg.toDate,
          shareholderStatusEnum: queryArg.shareholderStatusEnum,
        },
      }),
    }),
    bankAllocationsReport: build.query<
      BankAllocationsReportApiResponse,
      BankAllocationsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/bankAllocations`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    branchPaymentReport: build.query<
      BranchPaymentReportApiResponse,
      BranchPaymentReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/branchPayment`,
        params: {
          fromDate: queryArg.fromDate,
          toDate: queryArg.toDate,
          businessUnit: queryArg.businessUnit,
        },
      }),
    }),
    branchPaymentSummaryReport: build.query<
      BranchPaymentSummaryReportApiResponse,
      BranchPaymentSummaryReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/branchPaymentSummary`,
        params: {
          fromDate: queryArg.fromDate,
          toDate: queryArg.toDate,
          businessUnit: queryArg.businessUnit,
        },
      }),
    }),
    dividendDecisionsReport: build.query<
      DividendDecisionsReportApiResponse,
      DividendDecisionsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/dividend_Decision`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    dividendPaymentsReport: build.query<
      DividendPaymentsReportApiResponse,
      DividendPaymentsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/dividend-payments`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    endOfDayDailyReport: build.query<
      EndOfDayDailyReportApiResponse,
      EndOfDayDailyReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/endOfDayDaily`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    expiredSubscriptionsReport: build.query<
      ExpiredSubscriptionsReportApiResponse,
      ExpiredSubscriptionsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/expiredSubscriptions/${queryArg.id}`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    listOfForeignNationalShareholdersReport: build.query<
      ListOfForeignNationalShareholdersReportApiResponse,
      ListOfForeignNationalShareholdersReportApiArg
    >({
      query: () => ({ url: `/api/Reports/foreign_national_shareholders` }),
    }),
    listofFractionalPaidUpAmountsReport: build.query<
      ListofFractionalPaidUpAmountsReportApiResponse,
      ListofFractionalPaidUpAmountsReportApiArg
    >({
      query: () => ({ url: `/api/Reports/fractional_paidup_capital` }),
    }),
    listOfNewShareholdersReport: build.query<
      ListOfNewShareholdersReportApiResponse,
      ListOfNewShareholdersReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/new_shareholders`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    listofNewPaymentsImpactingPaidUpGlReport: build.query<
      ListofNewPaymentsImpactingPaidUpGlReportApiResponse,
      ListofNewPaymentsImpactingPaidUpGlReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/NewPayments-Impacting-PaidUpGL`,
        params: {
          fromDate: queryArg.fromDate,
          toDate: queryArg.toDate,
          shareholderStatusEnum: queryArg.shareholderStatusEnum,
          branchId: queryArg.branchId,
        },
      }),
    }),
    listofNewBranchPaymentsSummaryReport: build.query<
      ListofNewBranchPaymentsSummaryReportApiResponse,
      ListofNewBranchPaymentsSummaryReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/NewPayments-Impacting-PaidUpGLSummary`,
        params: {
          fromDate: queryArg.fromDate,
          toDate: queryArg.toDate,
          shareholderStatusEnum: queryArg.shareholderStatusEnum,
          branchId: queryArg.branchId,
        },
      }),
    }),
    organizationReport: build.query<
      OrganizationReportApiResponse,
      OrganizationReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/organizations/${queryArg.list}`,
      }),
    }),
    outstandingAllocationsReport: build.query<
      OutstandingAllocationsReportApiResponse,
      OutstandingAllocationsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/outstandingAllocations`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    outstandingSubscriptionsReport: build.query<
      OutstandingSubscriptionsReportApiResponse,
      OutstandingSubscriptionsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/outstandingSubscriptions`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    paidUpBalanceReport: build.query<
      PaidUpBalanceReportApiResponse,
      PaidUpBalanceReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/paidupbalance`,
        params: { todate: queryArg.todate },
      }),
    }),
    premiumCollectedReport: build.query<
      PremiumCollectedReportApiResponse,
      PremiumCollectedReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/premiumCollected`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    shareCertificateReport: build.query<
      ShareCertificateReportApiResponse,
      ShareCertificateReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/share-certificate/${queryArg.id}`,
        params: { certificateId: queryArg.certificateId },
      }),
    }),
    shareholderDividendDecisionReport: build.query<
      ShareholderDividendDecisionReportApiResponse,
      ShareholderDividendDecisionReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/Shareholder_Dividend_Decision`,
        params: { id: queryArg.id },
      }),
    }),
    shareholderPaymentsReport: build.query<
      ShareholderPaymentsReportApiResponse,
      ShareholderPaymentsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/shareholder-payments/${queryArg.id}`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    shareholderAllocationsReport: build.query<
      ShareholderAllocationsReportApiResponse,
      ShareholderAllocationsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/shareholderAllocations/${queryArg.id}`,
      }),
    }),
    subscriptionsReport: build.query<
      SubscriptionsReportApiResponse,
      SubscriptionsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/subscriptions/${queryArg.id}`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    topShareholderByPaidUpReport: build.query<
      TopShareholderByPaidUpReportApiResponse,
      TopShareholderByPaidUpReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/top-shareholders-bypaidup`,
        params: { count: queryArg.count },
      }),
    }),
    topSubscriptionsReport: build.query<
      TopSubscriptionsReportApiResponse,
      TopSubscriptionsReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/topSubscriptions/${queryArg.subscriptionAmount}`,
      }),
    }),
    transfersReport: build.query<
      TransfersReportApiResponse,
      TransfersReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/transfers`,
        params: { fromDate: queryArg.fromDate, toDate: queryArg.toDate },
      }),
    }),
    uncollectedDividendReport: build.query<
      UncollectedDividendReportApiResponse,
      UncollectedDividendReportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Reports/Uncollected_Dividend`,
        params: { id: queryArg.id },
      }),
    }),
    getShareholderById: build.query<
      GetShareholderByIdApiResponse,
      GetShareholderByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/Shareholders/${queryArg.id}` }),
    }),
    updateShareholder: build.mutation<
      UpdateShareholderApiResponse,
      UpdateShareholderApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}`,
        method: "POST",
        body: queryArg.updateShareholderCommand,
      }),
    }),
    addShareholderPhoto: build.mutation<
      AddShareholderPhotoApiResponse,
      AddShareholderPhotoApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/add-photo`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    addShareholderSignature: build.mutation<
      AddShareholderSignatureApiResponse,
      AddShareholderSignatureApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/add-signature`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    addShareholderAddress: build.mutation<
      AddShareholderAddressApiResponse,
      AddShareholderAddressApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/addresses`,
        method: "POST",
        body: queryArg.addressDto,
      }),
    }),
    updateShareholderAddress: build.mutation<
      UpdateShareholderAddressApiResponse,
      UpdateShareholderAddressApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/addresses`,
        method: "PUT",
        body: queryArg.addressDto,
      }),
    }),
    getShareholderAddresses: build.query<
      GetShareholderAddressesApiResponse,
      GetShareholderAddressesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/addresses`,
      }),
    }),
    addShareholderContact: build.mutation<
      AddShareholderContactApiResponse,
      AddShareholderContactApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/contacts`,
        method: "POST",
        body: queryArg.contactDto,
      }),
    }),
    updateShareholderContact: build.mutation<
      UpdateShareholderContactApiResponse,
      UpdateShareholderContactApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/contacts`,
        method: "PUT",
        body: queryArg.contactDto,
      }),
    }),
    getShareholderContacts: build.query<
      GetShareholderContactsApiResponse,
      GetShareholderContactsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/contacts`,
        params: { version: queryArg.version },
      }),
    }),
    getShareholderDocuments: build.query<
      GetShareholderDocumentsApiResponse,
      GetShareholderDocumentsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/documents`,
      }),
    }),
    getFamilies: build.mutation<GetFamiliesApiResponse, GetFamiliesApiArg>({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/families`,
        method: "POST",
        body: queryArg.getFamiliesRequest,
      }),
    }),
    addFamilyMembers: build.mutation<
      AddFamilyMembersApiResponse,
      AddFamilyMembersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/families/add`,
        method: "POST",
        body: queryArg.addFamilyMembersRequest,
      }),
    }),
    removeFamilyMember: build.mutation<
      RemoveFamilyMemberApiResponse,
      RemoveFamilyMemberApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/families/remove`,
        method: "POST",
        body: queryArg.removeFamilyMembersRequest,
      }),
    }),
    getShareholderInfo: build.query<
      GetShareholderInfoApiResponse,
      GetShareholderInfoApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/info`,
        params: { version: queryArg.version },
      }),
    }),
    addShareholderNote: build.mutation<
      AddShareholderNoteApiResponse,
      AddShareholderNoteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/note`,
        method: "POST",
        body: queryArg.note,
      }),
    }),
    getShareholderRecordVersions: build.query<
      GetShareholderRecordVersionsApiResponse,
      GetShareholderRecordVersionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.id}/record-versions`,
      }),
    }),
    getShareholderChangeLog: build.query<
      GetShareholderChangeLogApiResponse,
      GetShareholderChangeLogApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.shareholderId}/change-logs`,
      }),
    }),
    uploadShareholderDocument: build.mutation<
      UploadShareholderDocumentApiResponse,
      UploadShareholderDocumentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/${queryArg.shareholderId}/upload-shareholder-document/${queryArg.documentType}`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    addNewShareholder: build.mutation<
      AddNewShareholderApiResponse,
      AddNewShareholderApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/add`,
        method: "POST",
        body: queryArg.createShareholderCommand,
      }),
    }),
    getAllShareholders: build.query<
      GetAllShareholdersApiResponse,
      GetAllShareholdersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/all`,
        params: {
          status: queryArg.status,
          pageNumber: queryArg.pageNumber,
          pageSize: queryArg.pageSize,
        },
      }),
    }),
    approveShareholder: build.mutation<
      ApproveShareholderApiResponse,
      ApproveShareholderApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/approve-approval-request`,
        method: "POST",
        body: queryArg.changeWorkflowStatusEntityDto,
      }),
    }),
    blockShareholder: build.mutation<
      BlockShareholderApiResponse,
      BlockShareholderApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/block`,
        method: "POST",
        body: queryArg.blockShareholderCommand,
      }),
    }),
    getShareholderBlockDetail: build.query<
      GetShareholderBlockDetailApiResponse,
      GetShareholderBlockDetailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/block-detail/${queryArg.id}/${queryArg.versionNumber}`,
      }),
    }),
    uploadShareholderBlockDocument: build.mutation<
      UploadShareholderBlockDocumentApiResponse,
      UploadShareholderBlockDocumentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/block-detail/${queryArg.id}/document`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getShareholderCountPerApprovalStatus: build.query<
      GetShareholderCountPerApprovalStatusApiResponse,
      GetShareholderCountPerApprovalStatusApiArg
    >({
      query: () => ({ url: `/api/Shareholders/counts` }),
    }),
    rejectShareholderApprovalRequest: build.mutation<
      RejectShareholderApprovalRequestApiResponse,
      RejectShareholderApprovalRequestApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/reject-approval-request`,
        method: "POST",
        body: queryArg.changeWorkflowStatusEntityDto,
      }),
    }),
    saveShareholderRepresentative: build.mutation<
      SaveShareholderRepresentativeApiResponse,
      SaveShareholderRepresentativeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/save-shareholder-representative`,
        method: "POST",
        body: queryArg.saveShareholderRepresentativeCommand,
      }),
    }),
    submitForApproval: build.mutation<
      SubmitForApprovalApiResponse,
      SubmitForApprovalApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/submit-for-approval`,
        method: "POST",
        body: queryArg.changeWorkflowStatusEntityDto,
      }),
    }),
    typeaheadSearch: build.query<
      TypeaheadSearchApiResponse,
      TypeaheadSearchApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/typeahead-search`,
        params: { name: queryArg.name },
      }),
    }),
    unBlockShareholder: build.mutation<
      UnBlockShareholderApiResponse,
      UnBlockShareholderApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Shareholders/unblock`,
        method: "POST",
        body: queryArg.unBlockShareholderCommand,
      }),
    }),
    getSubscriptionAllocationById: build.query<
      GetSubscriptionAllocationByIdApiResponse,
      GetSubscriptionAllocationByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/SubscriptionAllocations/${queryArg.id}`,
      }),
    }),
    getSubscriptionGroupById: build.query<
      GetSubscriptionGroupByIdApiResponse,
      GetSubscriptionGroupByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/SubscriptionGroups/${queryArg.id}` }),
    }),
    getAllSubscriptionGroups: build.query<
      GetAllSubscriptionGroupsApiResponse,
      GetAllSubscriptionGroupsApiArg
    >({
      query: () => ({ url: `/api/SubscriptionGroups/all` }),
    }),
    createSubscriptionGroup: build.mutation<
      CreateSubscriptionGroupApiResponse,
      CreateSubscriptionGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/SubscriptionGroups/create`,
        method: "POST",
        body: queryArg.createSubscriptionGroupCommand,
      }),
    }),
    updateSubscriptionGroup: build.mutation<
      UpdateSubscriptionGroupApiResponse,
      UpdateSubscriptionGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/SubscriptionGroups/update`,
        method: "POST",
        body: queryArg.updateSubscriptionGroupCommand,
      }),
    }),
    addSubscription: build.mutation<
      AddSubscriptionApiResponse,
      AddSubscriptionApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Subscriptions/add`,
        method: "POST",
        body: queryArg.addSubscriptionCommand,
      }),
    }),
    attachPremiumPaymentReceipt: build.mutation<
      AttachPremiumPaymentReceiptApiResponse,
      AttachPremiumPaymentReceiptApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Subscriptions/attachments/premium-payment-receipt`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    attachSubscriptionForm: build.mutation<
      AttachSubscriptionFormApiResponse,
      AttachSubscriptionFormApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Subscriptions/attachments/subscription-form`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getShareholderSubscriptions: build.query<
      GetShareholderSubscriptionsApiResponse,
      GetShareholderSubscriptionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Subscriptions/shareholder/${queryArg.id}/all`,
      }),
    }),
    getShareholderSubscriptionSummary: build.query<
      GetShareholderSubscriptionSummaryApiResponse,
      GetShareholderSubscriptionSummaryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Subscriptions/shareholder/${queryArg.id}/subscriptions-summary`,
      }),
    }),
    getShareholderSubscriptionDocuments: build.query<
      GetShareholderSubscriptionDocumentsApiResponse,
      GetShareholderSubscriptionDocumentsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Subscriptions/shareholder/${queryArg.shareholderId}/subscriptions-documents`,
      }),
    }),
    updateSubscription: build.mutation<
      UpdateSubscriptionApiResponse,
      UpdateSubscriptionApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Subscriptions/update`,
        method: "POST",
        body: queryArg.updateSubscriptionCommand,
      }),
    }),
    deleteTransfer: build.mutation<
      DeleteTransferApiResponse,
      DeleteTransferApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Transfers/${queryArg.id}/delete`,
        method: "DELETE",
      }),
    }),
    uploadTransferDocument: build.mutation<
      UploadTransferDocumentApiResponse,
      UploadTransferDocumentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Transfers/${queryArg.transferId}/document/${queryArg.documentType}`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    createNewTransfer: build.mutation<
      CreateNewTransferApiResponse,
      CreateNewTransferApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Transfers/create1`,
        method: "POST",
        body: queryArg.addNewTransferCommand,
      }),
    }),
    getTransfersByShareholderId: build.query<
      GetTransfersByShareholderIdApiResponse,
      GetTransfersByShareholderIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Transfers/shareholder-transfers/${queryArg.shareholderId}`,
      }),
    }),
    savePaymentTransfers: build.mutation<
      SavePaymentTransfersApiResponse,
      SavePaymentTransfersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Transfers/transfer-payments`,
        method: "POST",
        body: queryArg.savePaymentTransfersCommand,
      }),
    }),
    updateTransfer: build.mutation<
      UpdateTransferApiResponse,
      UpdateTransferApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Transfers/update`,
        method: "POST",
        body: queryArg.updateTransferCommand,
      }),
    }),
    currentUserInfo: build.query<
      CurrentUserInfoApiResponse,
      CurrentUserInfoApiArg
    >({
      query: () => ({ url: `/api/Users/current` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as SMSApi };
export type ActivateUserApiResponse = /** status 200 Success */ undefined;
export type ActivateUserApiArg = {
  userEmail: UserEmail;
};
export type ChangePasswordApiResponse = /** status 200 Success */ undefined;
export type ChangePasswordApiArg = {
  changePasswordPayload: ChangePasswordPayload;
};
export type DeactivateUserApiResponse = /** status 200 Success */ undefined;
export type DeactivateUserApiArg = {
  userEmail: UserEmail;
};
export type ForgotPasswordApiResponse = /** status 200 Success */ undefined;
export type ForgotPasswordApiArg = {
  forgotPasswordPayload: ForgotPasswordPayload;
};
export type LoginApiResponse = /** status 200 Success */ LoginRes;
export type LoginApiArg = {
  returnUrl?: string;
  loginDto: LoginDto;
};
export type LogoutApiResponse = unknown;
export type LogoutApiArg = void;
export type ResetPasswordApiResponse = /** status 200 Success */ undefined;
export type ResetPasswordApiArg = {
  resetPasswordPayload: ResetPasswordPayload;
};
export type VerificationCodeApiResponse = /** status 200 Success */ undefined;
export type VerificationCodeApiArg = {
  verificationCode: VerificationCode;
};
export type RegisterUserApiResponse = /** status 200 Success */ SmsUser;
export type RegisterUserApiArg = {
  registerDto: RegisterDto;
};
export type GetRolesApiResponse = /** status 200 Success */ ApplicationRole[];
export type GetRolesApiArg = void;
export type AddClaimsApiResponse = /** status 200 Success */ UserDto;
export type AddClaimsApiArg = {
  userId?: string;
  body: {
    [key: string]: string;
  };
};
export type UsersApiResponse = /** status 200 Success */ UserDetail[];
export type UsersApiArg = void;
export type GetUserDetailApiResponse = /** status 200 Success */ UserDetail;
export type GetUserDetailApiArg = {
  id?: string;
};
export type AddUserRoleApiResponse = /** status 200 Success */ UserDetail;
export type AddUserRoleApiArg = {
  id?: string;
  role?: string;
};
export type RemoveUserRoleApiResponse = /** status 200 Success */ UserDetail;
export type RemoveUserRoleApiArg = {
  id?: string;
  role?: string;
};
export type GetAllAllocationsApiResponse =
  /** status 200 Success */ Allocations;
export type GetAllAllocationsApiArg = void;
export type ApproveAllocationApiResponse = unknown;
export type ApproveAllocationApiArg = {
  approveAllocationCommand: ApproveAllocationCommand;
};
export type GetAllBankAllocationsApiResponse =
  /** status 200 Success */ BankAllocations;
export type GetAllBankAllocationsApiArg = void;
export type ApproveBankAllocationApiResponse = unknown;
export type ApproveBankAllocationApiArg = {
  approveBankAllocationCommand: ApproveBankAllocationCommand;
};
export type RejectBankAllocationApiResponse = unknown;
export type RejectBankAllocationApiArg = {
  rejectBankAllocationCommand: RejectBankAllocationCommand;
};
export type SetBankAllocationApiResponse = unknown;
export type SetBankAllocationApiArg = {
  setBankAllocationCommand: SetBankAllocationCommand;
};
export type SubmitBankAllocationForApprovalApiResponse = unknown;
export type SubmitBankAllocationForApprovalApiArg = {
  submitBankAllocationApprovalRequestCommand: SubmitBankAllocationApprovalRequestCommand;
};
export type CreateAllocationApiResponse = /** status 200 Success */ number;
export type CreateAllocationApiArg = {
  createAllocationCommand: CreateAllocationCommand;
};
export type RejectAllocationApiResponse = unknown;
export type RejectAllocationApiArg = {
  rejectAllocationCommand: RejectAllocationCommand;
};
export type GetAllShareholderAllocationsApiResponse =
  /** status 200 Success */ ShareholderAllocationDto[];
export type GetAllShareholderAllocationsApiArg = {
  shareholderId: number;
};
export type SubmitAllocationForApprovalApiResponse = unknown;
export type SubmitAllocationForApprovalApiArg = {
  submitAllocationApprovalRequestCommand: SubmitAllocationApprovalRequestCommand;
};
export type GetAllocationSummariesApiResponse =
  /** status 200 Success */ AllocationSubscriptionSummaryDto[];
export type GetAllocationSummariesApiArg = void;
export type UpdateAllocationApiResponse = /** status 200 Success */ number;
export type UpdateAllocationApiArg = {
  updateAllocationCommand: UpdateAllocationCommand;
};
export type GetShareholderCertificatesApiResponse =
  /** status 200 Success */ CertificateSummeryDto;
export type GetShareholderCertificatesApiArg = {
  id: number;
};
export type ActivateCertificateApiResponse = unknown;
export type ActivateCertificateApiArg = {
  certificateDto: CertificateDto;
};
export type UploadCertificateIssueDocumentApiResponse = unknown;
export type UploadCertificateIssueDocumentApiArg = {
  id: number;
  body: {
    file?: Blob;
  };
};
export type DeactivateCertificateApiResponse = unknown;
export type DeactivateCertificateApiArg = {
  certificateDto: CertificateDto;
};
export type PrepareShareholderCertificateApiResponse =
  /** status 200 Success */ number;
export type PrepareShareholderCertificateApiArg = {
  prepareShareholderCertificateCommand: PrepareShareholderCertificateCommand;
};
export type UpdateShareholderCertificateApiResponse =
  /** status 200 Success */ number;
export type UpdateShareholderCertificateApiArg = {
  updateShareholderCertificateCommand: UpdateShareholderCertificateCommand;
};
export type GetShareholderDividendsApiResponse =
  /** status 200 Success */ ShareholderDividendsResult;
export type GetShareholderDividendsApiArg = {
  shareholderId: number;
};
export type AddNewDividendSetupApiResponse = unknown;
export type AddNewDividendSetupApiArg = {
  addDividendSetupCommand: AddDividendSetupCommand;
};
export type ApproveDividendSetupApiResponse = unknown;
export type ApproveDividendSetupApiArg = {
  approveDividendSetupCommand: ApproveDividendSetupCommand;
};
export type ComputeDividendRateApiResponse = unknown;
export type ComputeDividendRateApiArg = {
  computeDividendRateCommand: ComputeDividendRateCommand;
};
export type AttachDividendDecisionDocumentApiResponse = unknown;
export type AttachDividendDecisionDocumentApiArg = {
  id: number;
  body: {
    file?: Blob;
  };
};
export type GetDividendDecisionsSummaryApiResponse =
  /** status 200 Success */ GetDividendDecisionsSummaryQueryResult;
export type GetDividendDecisionsSummaryApiArg = void;
export type EvaluateDividendDecisionApiResponse =
  /** status 200 Success */ DividendComputationResults;
export type EvaluateDividendDecisionApiArg = {
  computeDividendDecisionCommand: ComputeDividendDecisionCommand;
};
export type GetDividendPeriodsApiResponse =
  /** status 200 Success */ DividendPeriodDto[];
export type GetDividendPeriodsApiArg = void;
export type GetSetupDividendsApiResponse =
  /** status 200 Success */ SetupDividendsDto;
export type GetSetupDividendsApiArg = {
  setupId: number;
  pageNumber?: number;
  pageSize?: number;
};
export type GetSetupsApiResponse = /** status 200 Success */ DividendSetupDto[];
export type GetSetupsApiArg = void;
export type GetShareholderDividendDetailApiResponse =
  /** status 200 Success */ GetShareholderDividendDetailResult;
export type GetShareholderDividendDetailApiArg = {
  setupId: number;
  shareholderId: number;
};
export type SubmitDividendDecisionApiResponse = unknown;
export type SubmitDividendDecisionApiArg = {
  saveDividendDecisionCommand: SaveDividendDecisionCommand;
};
export type TaxPendingDecisionsApiResponse = unknown;
export type TaxPendingDecisionsApiArg = {
  taxPendingDecisionsCommand: TaxPendingDecisionsCommand;
};
export type UpdateDividendSetupApiResponse = unknown;
export type UpdateDividendSetupApiArg = {
  updateDividendSetupCommand: UpdateDividendSetupCommand;
};
export type GetApiDocumentsByIdApiResponse = /** status 200 Success */ Blob;
export type GetApiDocumentsByIdApiArg = {
  id: string;
};
export type DownloadDocumentApiResponse = /** status 200 Success */ Blob;
export type DownloadDocumentApiArg = {
  id: string;
};
export type DocumentRootPathApiResponse =
  /** status 200 Success */ DocumentEndpointRootPath;
export type DocumentRootPathApiArg = void;
export type ExportToCsvFileApiResponse =
  /** status 200 Success */ ProcessEodDto;
export type ExportToCsvFileApiArg = {
  body: ProcessEodDto[];
};
export type GetAllTransactionsApiResponse =
  /** status 200 Success */ EndOfDayDto;
export type GetAllTransactionsApiArg = void;
export type GetCoreTransactionApiResponse =
  /** status 200 Success */ RigsTransaction[];
export type GetCoreTransactionApiArg = {
  transactionDate?: string;
};
export type GetDailyTransactionsApiResponse =
  /** status 200 Success */ DailyTransactionListResponse;
export type GetDailyTransactionsApiArg = {
  transactionDate?: string;
  pageSize?: number;
  pageNumber?: number;
};
export type ProcessEodApiResponse = /** status 200 Success */ EndOfDayDto[];
export type ProcessEodApiArg = {
  date?: string;
  description?: string;
  body: EndOfDayDto[];
};
export type GetAllLookupsApiResponse = /** status 200 Success */ LookupsDto;
export type GetAllLookupsApiArg = void;
export type ApproveParValueApiResponse = unknown;
export type ApproveParValueApiArg = {
  approveParValueCommand: ApproveParValueCommand;
};
export type CreateParValueApiResponse = /** status 200 Success */ number;
export type CreateParValueApiArg = {
  createParValueCommand: CreateParValueCommand;
};
export type GetAllParValuesApiResponse = /** status 200 Success */ ParValues;
export type GetAllParValuesApiArg = void;
export type RejectParValueApiResponse = unknown;
export type RejectParValueApiArg = {
  rejectParValueCommand: RejectParValueCommand;
};
export type SubmitParValueForApprovalApiResponse = unknown;
export type SubmitParValueForApprovalApiArg = {
  submitParValueApprovalRequestCommand: SubmitParValueApprovalRequestCommand;
};
export type UpdateParValueApiResponse = unknown;
export type UpdateParValueApiArg = {
  updateParValueCommand: UpdateParValueCommand;
};
export type UploadSubscriptionPaymentReceiptApiResponse = unknown;
export type UploadSubscriptionPaymentReceiptApiArg = {
  id: number;
  body: {
    file?: Blob;
  };
};
export type MakePaymentApiResponse = unknown;
export type MakePaymentApiArg = {
  makeSubscriptionPaymentCommand: MakeSubscriptionPaymentCommand;
};
export type AddNewAdjustmentApiResponse = unknown;
export type AddNewAdjustmentApiArg = {
  addPaymentAdjustmentCommand: AddPaymentAdjustmentCommand;
};
export type GetSubscriptionPaymentsApiResponse =
  /** status 200 Success */ SubscriptionPayments;
export type GetSubscriptionPaymentsApiArg = {
  id: number;
};
export type UpdatePaymentApiResponse = unknown;
export type UpdatePaymentApiArg = {
  updateSubscriptionPaymentCommand: UpdateSubscriptionPaymentCommand;
};
export type UpdatePaymentAdjustmentApiResponse = unknown;
export type UpdatePaymentAdjustmentApiArg = {
  updatePaymentAdjustmentCommand: UpdatePaymentAdjustmentCommand;
};
export type ListOfActiveShareholdersReportApiResponse =
  /** status 200 Success */ Blob;
export type ListOfActiveShareholdersReportApiArg = {
  fromDate?: string;
  toDate?: string;
  shareholderStatusEnum?: ShareholderStatusEnum;
};
export type ActiveShareholderListForGaApiResponse =
  /** status 200 Success */ Blob;
export type ActiveShareholderListForGaApiArg = void;
export type ListofAddtionalSharePaymentsReportApiResponse =
  /** status 200 Success */ Blob;
export type ListofAddtionalSharePaymentsReportApiArg = {
  fromDate?: string;
  toDate?: string;
  shareholderStatusEnum?: ShareholderStatusEnum;
};
export type BankAllocationsReportApiResponse = /** status 200 Success */ Blob;
export type BankAllocationsReportApiArg = {
  fromDate?: string;
  toDate?: string;
};
export type BranchPaymentReportApiResponse = /** status 200 Success */ Blob;
export type BranchPaymentReportApiArg = {
  fromDate?: string;
  toDate?: string;
  businessUnit?: number;
};
export type BranchPaymentSummaryReportApiResponse =
  /** status 200 Success */ Blob;
export type BranchPaymentSummaryReportApiArg = {
  fromDate?: string;
  toDate?: string;
  businessUnit?: number;
};
export type DividendDecisionsReportApiResponse = /** status 200 Success */ Blob;
export type DividendDecisionsReportApiArg = {
  fromDate?: string;
  toDate?: string;
};
export type DividendPaymentsReportApiResponse = /** status 200 Success */ Blob;
export type DividendPaymentsReportApiArg = {
  fromDate?: string;
  toDate?: string;
};
export type EndOfDayDailyReportApiResponse = /** status 200 Success */ Blob;
export type EndOfDayDailyReportApiArg = {
  fromDate?: string;
  toDate?: string;
};
export type ExpiredSubscriptionsReportApiResponse =
  /** status 200 Success */ Blob;
export type ExpiredSubscriptionsReportApiArg = {
  id: number;
  fromDate?: string;
  toDate?: string;
};
export type ListOfForeignNationalShareholdersReportApiResponse =
  /** status 200 Success */ Blob;
export type ListOfForeignNationalShareholdersReportApiArg = void;
export type ListofFractionalPaidUpAmountsReportApiResponse =
  /** status 200 Success */ Blob;
export type ListofFractionalPaidUpAmountsReportApiArg = void;
export type ListOfNewShareholdersReportApiResponse =
  /** status 200 Success */ Blob;
export type ListOfNewShareholdersReportApiArg = {
  fromDate?: string;
  toDate?: string;
};
export type ListofNewPaymentsImpactingPaidUpGlReportApiResponse =
  /** status 200 Success */ Blob;
export type ListofNewPaymentsImpactingPaidUpGlReportApiArg = {
  fromDate?: string;
  toDate?: string;
  shareholderStatusEnum?: ShareholderStatusEnum;
  branchId?: number;
};
export type ListofNewBranchPaymentsSummaryReportApiResponse =
  /** status 200 Success */ Blob;
export type ListofNewBranchPaymentsSummaryReportApiArg = {
  fromDate?: string;
  toDate?: string;
  shareholderStatusEnum?: ShareholderStatusEnum;
  branchId?: number;
};
export type OrganizationReportApiResponse = /** status 200 Success */ Blob;
export type OrganizationReportApiArg = {
  list: string;
};
export type OutstandingAllocationsReportApiResponse =
  /** status 200 Success */ Blob;
export type OutstandingAllocationsReportApiArg = {
  fromDate?: string;
  toDate?: string;
};
export type OutstandingSubscriptionsReportApiResponse =
  /** status 200 Success */ Blob;
export type OutstandingSubscriptionsReportApiArg = {
  fromDate?: string;
  toDate?: string;
};
export type PaidUpBalanceReportApiResponse = /** status 200 Success */ Blob;
export type PaidUpBalanceReportApiArg = {
  todate?: string;
};
export type PremiumCollectedReportApiResponse = /** status 200 Success */ Blob;
export type PremiumCollectedReportApiArg = {
  fromDate?: string;
  toDate?: string;
};
export type ShareCertificateReportApiResponse = /** status 200 Success */ Blob;
export type ShareCertificateReportApiArg = {
  id: number;
  certificateId?: number;
};
export type ShareholderDividendDecisionReportApiResponse =
  /** status 200 Success */ Blob;
export type ShareholderDividendDecisionReportApiArg = {
  id?: number;
};
export type ShareholderPaymentsReportApiResponse =
  /** status 200 Success */ Blob;
export type ShareholderPaymentsReportApiArg = {
  id: number;
  fromDate?: string;
  toDate?: string;
};
export type ShareholderAllocationsReportApiResponse =
  /** status 200 Success */ Blob;
export type ShareholderAllocationsReportApiArg = {
  id: number;
};
export type SubscriptionsReportApiResponse = /** status 200 Success */ Blob;
export type SubscriptionsReportApiArg = {
  id: number;
  fromDate?: string;
  toDate?: string;
};
export type TopShareholderByPaidUpReportApiResponse =
  /** status 200 Success */ Blob;
export type TopShareholderByPaidUpReportApiArg = {
  count?: number;
};
export type TopSubscriptionsReportApiResponse = /** status 200 Success */ Blob;
export type TopSubscriptionsReportApiArg = {
  subscriptionAmount: number;
};
export type TransfersReportApiResponse = /** status 200 Success */ Blob;
export type TransfersReportApiArg = {
  fromDate?: string;
  toDate?: string;
};
export type UncollectedDividendReportApiResponse =
  /** status 200 Success */ Blob;
export type UncollectedDividendReportApiArg = {
  id?: number;
};
export type GetShareholderByIdApiResponse =
  /** status 200 Success */ ShareholderDetailsDto;
export type GetShareholderByIdApiArg = {
  id: number;
};
export type UpdateShareholderApiResponse = /** status 200 Success */ number;
export type UpdateShareholderApiArg = {
  id: number;
  updateShareholderCommand: UpdateShareholderCommand;
};
export type AddShareholderPhotoApiResponse =
  /** status 200 Success */ DocumentMetadataDto;
export type AddShareholderPhotoApiArg = {
  id: number;
  body: {
    file?: Blob;
    subscriptionId?: number;
    paymentId?: number;
    transferId?: number;
  };
};
export type AddShareholderSignatureApiResponse =
  /** status 200 Success */ DocumentMetadataDto;
export type AddShareholderSignatureApiArg = {
  id: number;
  body: {
    file?: Blob;
    subscriptionId?: number;
    paymentId?: number;
    transferId?: number;
  };
};
export type AddShareholderAddressApiResponse = /** status 200 Success */ number;
export type AddShareholderAddressApiArg = {
  id: number;
  addressDto: AddressDto;
};
export type UpdateShareholderAddressApiResponse =
  /** status 200 Success */ number;
export type UpdateShareholderAddressApiArg = {
  id: number;
  addressDto: AddressDto;
};
export type GetShareholderAddressesApiResponse =
  /** status 200 Success */ AddressDto[];
export type GetShareholderAddressesApiArg = {
  id: number;
};
export type AddShareholderContactApiResponse = /** status 200 Success */ number;
export type AddShareholderContactApiArg = {
  id: number;
  contactDto: ContactDto;
};
export type UpdateShareholderContactApiResponse =
  /** status 200 Success */ number;
export type UpdateShareholderContactApiArg = {
  id: number;
  contactDto: ContactDto;
};
export type GetShareholderContactsApiResponse =
  /** status 200 Success */ ContactDto[];
export type GetShareholderContactsApiArg = {
  id: number;
  version?: string;
};
export type GetShareholderDocumentsApiResponse =
  /** status 200 Success */ ShareholderDocumentDto[];
export type GetShareholderDocumentsApiArg = {
  id: number;
};
export type GetFamiliesApiResponse = /** status 200 Success */ FamilyDto[];
export type GetFamiliesApiArg = {
  id: number;
  getFamiliesRequest: GetFamiliesRequest;
};
export type AddFamilyMembersApiResponse = /** status 200 Success */ FamilyDto;
export type AddFamilyMembersApiArg = {
  id: number;
  addFamilyMembersRequest: AddFamilyMembersRequest;
};
export type RemoveFamilyMemberApiResponse = unknown;
export type RemoveFamilyMemberApiArg = {
  id: number;
  removeFamilyMembersRequest: RemoveFamilyMembersRequest;
};
export type GetShareholderInfoApiResponse =
  /** status 200 Success */ ShareholderInfo;
export type GetShareholderInfoApiArg = {
  id: number;
  version?: string;
};
export type AddShareholderNoteApiResponse = unknown;
export type AddShareholderNoteApiArg = {
  id: number;
  note: Note;
};
export type GetShareholderRecordVersionsApiResponse =
  /** status 200 Success */ ShareholderRecordVersions;
export type GetShareholderRecordVersionsApiArg = {
  id: number;
};
export type GetShareholderChangeLogApiResponse =
  /** status 200 Success */ ShareholderChangeLogDto[];
export type GetShareholderChangeLogApiArg = {
  shareholderId: number;
};
export type UploadShareholderDocumentApiResponse =
  /** status 200 Success */ DocumentMetadataDto;
export type UploadShareholderDocumentApiArg = {
  shareholderId: number;
  documentType: DocumentType;
  body: {
    file?: Blob;
    subscriptionId?: number;
    paymentId?: number;
    transferId?: number;
  };
};
export type AddNewShareholderApiResponse = /** status 200 Success */ number;
export type AddNewShareholderApiArg = {
  createShareholderCommand: CreateShareholderCommand;
};
export type GetAllShareholdersApiResponse =
  /** status 200 Success */ ShareholderSearchResult;
export type GetAllShareholdersApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type ApproveShareholderApiResponse = unknown;
export type ApproveShareholderApiArg = {
  changeWorkflowStatusEntityDto: ChangeWorkflowStatusEntityDto;
};
export type BlockShareholderApiResponse = unknown;
export type BlockShareholderApiArg = {
  blockShareholderCommand: BlockShareholderCommand;
};
export type GetShareholderBlockDetailApiResponse =
  /** status 200 Success */ ShareholderBlockDetail;
export type GetShareholderBlockDetailApiArg = {
  id: number;
  versionNumber: string;
};
export type UploadShareholderBlockDocumentApiResponse = unknown;
export type UploadShareholderBlockDocumentApiArg = {
  id: number;
  body: {
    file?: Blob;
  };
};
export type GetShareholderCountPerApprovalStatusApiResponse =
  /** status 200 Success */ ShareholderCountsByStatus;
export type GetShareholderCountPerApprovalStatusApiArg = void;
export type RejectShareholderApprovalRequestApiResponse = unknown;
export type RejectShareholderApprovalRequestApiArg = {
  changeWorkflowStatusEntityDto: ChangeWorkflowStatusEntityDto;
};
export type SaveShareholderRepresentativeApiResponse = unknown;
export type SaveShareholderRepresentativeApiArg = {
  saveShareholderRepresentativeCommand: SaveShareholderRepresentativeCommand;
};
export type SubmitForApprovalApiResponse = unknown;
export type SubmitForApprovalApiArg = {
  changeWorkflowStatusEntityDto: ChangeWorkflowStatusEntityDto;
};
export type TypeaheadSearchApiResponse =
  /** status 200 Success */ ShareholderBasicInfo[];
export type TypeaheadSearchApiArg = {
  name?: string;
};
export type UnBlockShareholderApiResponse = unknown;
export type UnBlockShareholderApiArg = {
  unBlockShareholderCommand: UnBlockShareholderCommand;
};
export type GetSubscriptionAllocationByIdApiResponse =
  /** status 200 Success */ GetSubscriptionAllocationQuery;
export type GetSubscriptionAllocationByIdApiArg = {
  id: number;
};
export type GetSubscriptionGroupByIdApiResponse =
  /** status 200 Success */ SubscriptionGroupInfo;
export type GetSubscriptionGroupByIdApiArg = {
  id: number;
};
export type GetAllSubscriptionGroupsApiResponse =
  /** status 200 Success */ SubscriptionGroupInfo[];
export type GetAllSubscriptionGroupsApiArg = void;
export type CreateSubscriptionGroupApiResponse = unknown;
export type CreateSubscriptionGroupApiArg = {
  createSubscriptionGroupCommand: CreateSubscriptionGroupCommand;
};
export type UpdateSubscriptionGroupApiResponse = unknown;
export type UpdateSubscriptionGroupApiArg = {
  updateSubscriptionGroupCommand: UpdateSubscriptionGroupCommand;
};
export type AddSubscriptionApiResponse = unknown;
export type AddSubscriptionApiArg = {
  addSubscriptionCommand: AddSubscriptionCommand;
};
export type AttachPremiumPaymentReceiptApiResponse =
  /** status 200 Success */ DocumentMetadataDto;
export type AttachPremiumPaymentReceiptApiArg = {
  body: {
    file?: Blob;
    subscriptionId?: number;
  };
};
export type AttachSubscriptionFormApiResponse =
  /** status 200 Success */ DocumentMetadataDto;
export type AttachSubscriptionFormApiArg = {
  body: {
    file?: Blob;
    subscriptionId?: number;
  };
};
export type GetShareholderSubscriptionsApiResponse =
  /** status 200 Success */ ShareholderSubscriptions;
export type GetShareholderSubscriptionsApiArg = {
  id: number;
};
export type GetShareholderSubscriptionSummaryApiResponse =
  /** status 200 Success */ ShareholderSubscriptionsSummary;
export type GetShareholderSubscriptionSummaryApiArg = {
  id: number;
};
export type GetShareholderSubscriptionDocumentsApiResponse =
  /** status 200 Success */ SubscriptionDocumentDto[];
export type GetShareholderSubscriptionDocumentsApiArg = {
  shareholderId: number;
};
export type UpdateSubscriptionApiResponse = unknown;
export type UpdateSubscriptionApiArg = {
  updateSubscriptionCommand: UpdateSubscriptionCommand;
};
export type DeleteTransferApiResponse = unknown;
export type DeleteTransferApiArg = {
  id: number;
};
export type UploadTransferDocumentApiResponse = unknown;
export type UploadTransferDocumentApiArg = {
  transferId: number;
  documentType: TransferDocumentType;
  body: {
    file?: Blob;
  };
};
export type CreateNewTransferApiResponse = unknown;
export type CreateNewTransferApiArg = {
  addNewTransferCommand: AddNewTransferCommand;
};
export type GetTransfersByShareholderIdApiResponse =
  /** status 200 Success */ TransferDto[];
export type GetTransfersByShareholderIdApiArg = {
  shareholderId: number;
};
export type SavePaymentTransfersApiResponse = unknown;
export type SavePaymentTransfersApiArg = {
  savePaymentTransfersCommand: SavePaymentTransfersCommand;
};
export type UpdateTransferApiResponse = unknown;
export type UpdateTransferApiArg = {
  updateTransferCommand: UpdateTransferCommand;
};
export type CurrentUserInfoApiResponse = /** status 200 Success */ UserDto;
export type CurrentUserInfoApiArg = void;
export type ProblemDetails = {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
};
export type UserEmail = {
  email?: string | null;
};
export type ChangePasswordPayload = {
  currentPassword?: string | null;
  newPassword?: string | null;
};
export type ForgotPasswordPayload = {
  email?: string | null;
};
export type LoginRes = {
  isSuccess?: boolean;
  needVerification?: boolean | null;
  isLockedOut?: boolean | null;
};
export type LoginDto = {
  email?: string | null;
  password?: string | null;
};
export type ResetPasswordPayload = {
  password?: string | null;
  email?: string | null;
  token?: string | null;
};
export type VerificationCode = {
  code?: string | null;
};
export type Branch = {
  id?: number;
  districtId?: number;
  branchName?: string | null;
  branchCode?: string | null;
  branchShareGL?: string | null;
  isHeadOffice?: boolean | null;
};
export type IdentityRoleClaimOfString = {
  id?: number;
  roleId?: string | null;
  claimType?: string | null;
  claimValue?: string | null;
};
export type SmsRole = {
  id?: string | null;
  name?: string | null;
  normalizedName?: string | null;
  concurrencyStamp?: string | null;
  description?: string | null;
  displayName?: string | null;
  claims?: IdentityRoleClaimOfString[] | null;
};
export type UserRole = {
  userId?: string | null;
  roleId?: string | null;
  role?: SmsRole;
  user?: SmsUser;
};
export type SmsUser = {
  id?: string | null;
  userName?: string | null;
  normalizedUserName?: string | null;
  email?: string | null;
  normalizedEmail?: string | null;
  emailConfirmed?: boolean;
  passwordHash?: string | null;
  securityStamp?: string | null;
  concurrencyStamp?: string | null;
  phoneNumber?: string | null;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string | null;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  branchId?: number;
  isDeactivated?: boolean;
  branch?: Branch;
  roles?: UserRole[] | null;
};
export type RegisterDto = {
  email?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  branchId?: number;
  roles?: string[] | null;
};
export type ApplicationRole = {
  name?: string | null;
  displayName?: string | null;
  description?: string | null;
};
export type Permission = {
  name?: string | null;
  hasPermission?: boolean;
};
export type UserDto = {
  id?: string | null;
  email?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  branchId?: number;
  roles?: string[] | null;
  permissions?: Permission[] | null;
  fullName?: string | null;
};
export type Role = {
  id?: string | null;
  name?: string | null;
  displayName?: string | null;
  description?: string | null;
};
export type Claim = {
  claimType?: string | null;
  claimValue?: string | null;
};
export type UserDetail = {
  id?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  email?: string | null;
  branchId?: number;
  accessFailedCount?: number;
  roles?: Role[] | null;
  claims?: Claim[] | null;
  isDeactivated?: boolean;
};
export type ApprovalStatus = 1 | 2 | 3 | 4;
export type AllocationDto = {
  id?: number;
  name?: string | null;
  amount?: number;
  fromDate?: string;
  toDate?: string | null;
  isActive?: boolean;
  isLatestRecord?: boolean;
  isOnlyForExistingShareholders?: boolean | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  workflowComment?: string | null;
  isDividendAllocation?: boolean;
};
export type Allocations = {
  approved?: AllocationDto[] | null;
  submitted?: AllocationDto[] | null;
  rejected?: AllocationDto[] | null;
  draft?: AllocationDto[] | null;
};
export type ApproveAllocationCommand = {
  id?: number;
  comment?: string | null;
};
export type BankAllocationDto = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  amount?: number;
  name?: string | null;
  maxPercentagePurchaseLimit?: number | null;
  description?: string | null;
};
export type BankAllocations = {
  approved?: BankAllocationDto[] | null;
  submitted?: BankAllocationDto[] | null;
  rejected?: BankAllocationDto[] | null;
  draft?: BankAllocationDto[] | null;
};
export type ApproveBankAllocationCommand = {
  id?: number;
  comment?: string | null;
};
export type RejectBankAllocationCommand = {
  id?: number;
  comment?: string | null;
};
export type SetBankAllocationCommand = {
  amount?: number;
  name?: string | null;
  maxPercentagePurchaseLimit?: number | null;
  description?: string | null;
};
export type SubmitBankAllocationApprovalRequestCommand = {
  id?: number;
  comment?: string | null;
};
export type AllocationType = 1 | 2;
export type CreateAllocationPayload = {
  amount?: number;
  name?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  description?: string | null;
  allocationType?: AllocationType;
  isOnlyForExistingShareholders?: boolean | null;
  isDividendAllocation?: boolean;
};
export type CreateAllocationCommand = {
  payload?: CreateAllocationPayload;
};
export type RejectAllocationCommand = {
  id?: number;
  comment?: string | null;
};
export type ShareholderAllocationDto = {
  allocationId?: number;
  maxPurchaseLimit?: number | null;
  approvedSubscriptionsTotal?: number;
  submittedSubscriptionsTotal?: number;
  approvedPaymentsTotal?: number;
  submittedPaymentsTotal?: number;
};
export type SubmitAllocationApprovalRequestCommand = {
  id?: number;
  comment?: string | null;
};
export type AllocationSubscriptionSummaryDto = {
  id?: number;
  allocationId?: number;
  totalAllocation?: number;
  totalApprovedSubscriptions?: number;
  totalPendingApprovalSubscriptions?: number;
  lastSubscriptionId?: number | null;
  lastSubscriptionApprovalStatus?: ApprovalStatus;
  lastSubscriptionAmount?: number | null;
  totalApprovedPayments?: number;
  totalPendingApprovalPayments?: number;
  lastPaymentId?: number | null;
  lastPaymentApprovalStatus?: ApprovalStatus;
  lastPaymentAmount?: number | null;
  allocationName?: string | null;
  allocationDescription?: string | null;
  isOnlyForExistingShareholders?: boolean | null;
  isDividendAllocation?: boolean | null;
  note?: string | null;
};
export type UpdateAllocationCommand = {
  id?: number;
  name?: string | null;
  amount?: number;
  fromDate?: string | null;
  toDate?: string | null;
  description?: string | null;
  isOnlyForExistingShareholders?: boolean | null;
};
export type PaymentMethodEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type CertificateIssuanceTypeEnum = 1 | 2 | 3;
export type CertificateDto = {
  id?: number;
  certificateNo?: string | null;
  serialNumberRange?: string | null;
  paymentMethodEnum?: PaymentMethodEnum;
  certificateIssuanceTypeEnum?: CertificateIssuanceTypeEnum;
  shareholderId?: number;
  issueDate?: string;
  paidupAmount?: number;
  receiptNo?: string | null;
  isActive?: boolean;
  approvalStatus?: ApprovalStatus;
  isPrinted?: boolean;
  note?: string | null;
};
export type CertificateSummeryDto = {
  certificates?: CertificateDto[] | null;
  totalAvailablePaidup?: number;
};
export type ValidationProblemDetails = {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  errors?: {
    [key: string]: string[];
  } | null;
  [key: string]: any;
};
export type PrepareShareholderCertificateCommand = {
  id?: number;
  certificateNo?: string | null;
  serialNumberRange?: string | null;
  paymentMethodEnum?: PaymentMethodEnum;
  certificateIssuanceTypeEnum?: CertificateIssuanceTypeEnum;
  shareholderId?: number;
  issueDate?: string;
  paidupAmount?: number;
  receiptNo?: string | null;
  note?: string | null;
};
export type UpdateShareholderCertificateCommand = {
  id?: number;
  certificateNo?: string | null;
  serialNumberRange?: string | null;
  paymentMethodEnum?: PaymentMethodEnum;
  certificateIssuanceTypeEnum?: CertificateIssuanceTypeEnum;
  shareholderId?: number;
  issueDate?: string;
  paidupAmount?: number;
  receiptNo?: string | null;
  note?: string | null;
};
export type DividendDecisionType = 1 | 2 | 3 | 4;
export type DividendDistributionStatus = 1 | 2 | 3 | 4;
export type DividendRateComputationStatus = 1 | 2 | 3 | 4;
export type DividendSetupDto = {
  id?: number;
  dividendPeriodId?: number;
  declaredAmount?: number;
  dividendRate?: number;
  taxRate?: number;
  dividendTaxDueDate?: string;
  isTaxApplicable?: boolean;
  hasPendingDecision?: boolean;
  taxApplied?: boolean;
  additionalAllocationAmount?: number;
  distributionStatus?: DividendDistributionStatus;
  dividendRateComputationStatus?: DividendRateComputationStatus;
  approvalStatus?: ApprovalStatus;
  totalSubscriptionPayments?: number;
  totalWeightedAverageSubscriptionPayments?: number;
  description?: string | null;
};
export type ShareholderDividendDto = {
  id?: number;
  shareholderId?: number;
  dividendSetupId?: number;
  totalPaidAmount?: number;
  totalPaidWeightedAverage?: number;
  dividendAmount?: number;
  capitalizeLimit?: number;
  dividendSetup?: DividendSetupDto;
};
export type DividendDecisionDto = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  decision?: DividendDecisionType;
  decisionDate?: string | null;
  capitalizedAmount?: number;
  withdrawnAmount?: number;
  fulfillmentPayment?: number;
  additionalSharesWillingToBuy?: number;
  attachmentDocumentId?: string | null;
  attachmentDocumentFileName?: string | null;
  tax?: number;
  netPay?: number;
  decisionProcessed?: boolean;
  taxProcessed?: boolean;
  branchId?: number | null;
  districtId?: number | null;
  dividend?: ShareholderDividendDto;
};
export type DividendDecisionSummaryDto = {
  decisions?: DividendDecisionDto[] | null;
  totalDividendPayment?: number;
  totalCapitalizedAmount?: number;
  totalFulfillmentAmount?: number;
  totalWithdrawnAmount?: number;
  totalTaxPaid?: number;
  totalNetPay?: number;
};
export type ShareholderDividendsResult = {
  approved?: DividendDecisionSummaryDto;
  unapproved?: DividendDecisionSummaryDto;
};
export type AddDividendSetupCommand = {
  dividendPeriodId?: number;
  declaredAmount?: number;
  additionalAllocationAmount?: number;
  taxRate?: number;
  dividendTaxDueDate?: string;
  description?: string | null;
};
export type ApproveDividendSetupCommand = {
  setupID?: number;
};
export type ComputeDividendRateCommand = {
  setupID?: number;
};
export type DividendDecisionsSummary = {
  setupId?: number;
  totalAmount?: number;
};
export type GetDividendDecisionsSummaryQueryResult = {
  pending?: DividendDecisionsSummary[] | null;
  pendingTotal?: number;
  approved?: DividendDecisionsSummary[] | null;
  approvedTotal?: number;
  submitted?: DividendDecisionsSummary[] | null;
  submittedTotal?: number;
  draft?: DividendDecisionsSummary[] | null;
  draftTotal?: number;
};
export type DividendComputationResult = {
  id?: number;
  decision?: DividendDecisionType;
  capitalizedAmount?: number;
  fulfillmentAmount?: number;
  withdrawnAmount?: number;
  netPay?: number;
  tax?: number;
};
export type DividendComputationResults = {
  results?: DividendComputationResult[] | null;
  totalDividends?: number;
  totalCapitalized?: number;
  totalWithdrawn?: number;
  totalTax?: number;
  totalNetPay?: number;
  totalFulfillment?: number;
};
export type ComputeDividendDecisionCommand = {
  decisionIds?: number[] | null;
  amountToCapitalize?: number;
};
export type DividendPeriodDto = {
  id?: number;
  startDate?: string;
  endDate?: string;
  dayCount?: number;
  year?: string | null;
};
export type DividendDto = {
  id?: number;
  shareholderId?: number;
  shareholderDisplayName?: string | null;
  dividendSetupId?: number;
  totalPaidAmount?: number;
  capitalizeLimit?: number;
  totalPaidWeightedAverage?: number;
  dividendAmount?: number;
};
export type SetupDividendsDto = {
  dividends?: DividendDto[] | null;
  pageNumber?: number;
  pageSize?: number;
  totalDividendsCount?: number;
  totalSubscriptionPayments?: number;
  totalWeightedSubscriptionPayments?: number;
  totalDividends?: number;
  totalCapitalizationLimit?: number;
};
export type ShareholderDividendPaymentDto = {
  id?: number;
  paymentId?: number;
  shareholderId?: number;
  dividendSetupId?: number;
  amount?: number;
  effectiveDate?: string;
  endDate?: string | null;
  workingDays?: number;
  weightedAverageAmt?: number;
};
export type GetShareholderDividendDetailResult = {
  payments?: ShareholderDividendPaymentDto[] | null;
  totalPaymentAmount?: number;
  totalWeightedAveragePaymentAmount?: number;
};
export type SaveDividendDecisionCommand = {
  decisionIds?: number[] | null;
  amountToCapitalize?: number;
  decisionDate?: string;
  branchId?: number | null;
  districtId?: number | null;
  additionalSharesWillingToBuy?: number;
};
export type TaxPendingDecisionsCommand = {
  setupId?: number;
};
export type UpdateDividendSetupCommand = {
  id?: number;
  declaredAmount?: number;
  taxRate?: number;
  dividendTaxDueDate?: string;
  description?: string | null;
  additionalAllocationAmount?: number;
};
export type DocumentEndpointRootPath = {
  path?: string | null;
};
export type ProcessEodDto = {
  branchShareGl?: string | null;
  amount?: number;
  transactionType?: string | null;
  accountType?: string | null;
  transactionreferenceNumber?: string | null;
};
export type EndOfDayDto = {
  id?: number | null;
  date?: string;
  subscriptionId?: number | null;
  amount?: number;
  branchName?: string | null;
  branchShareGl?: string | null;
  paymentReceiptNo?: string | null;
  accountType?: string | null;
  transactionType?: string | null;
  description?: string | null;
  transactionReference?: string | null;
  paymentType?: string | null;
  isPosted?: boolean | null;
};
export type RigsTransaction = {
  id?: number;
  transactionIdField?: string | null;
  accountNumberField?: string | null;
  transactionDateField?: string | null;
  valueDateField?: string | null;
  transactionAmountField?: number;
  transactionAmountFieldSpecified?: boolean;
  currencyField?: string | null;
  transactionTypeField?: string | null;
  narrationField?: string | null;
  eventCodeField?: string | null;
  eventCodeDescriptionField?: string | null;
  businessUnitField?: string | null;
  statementBalanceField?: number;
  statementBalanceFieldSpecified?: boolean;
  contraAccountNumberField?: string | null;
  rrnField?: string | null;
  transactionReferenceTextField?: string | null;
  recordStatusField?: string | null;
  rigsUname?: string | null;
  rigsPname?: string | null;
  accountName?: string | null;
  accountType?: string | null;
  productName?: string | null;
  accountStatus?: string | null;
  availableBalance?: number;
  accountValidationMessage?: string | null;
};
export type BranchDto = {
  id?: number;
  districtID?: number;
  branchName?: string | null;
  branchCode?: string | null;
};
export type PaymentTypeEnum = 1 | 2 | 3 | 4 | 5;
export type PaymentType = {
  value?: PaymentTypeEnum;
  displayName?: string | null;
  description?: string | null;
};
export type PaymentMethod = {
  value?: PaymentMethodEnum;
  name?: string | null;
  description?: string | null;
};
export type GeneralLedgerTypeEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type PaymentInfo = {
  id?: number;
  amount?: number;
  subscriptionId?: number;
  effectiveDate?: string | null;
  endDate?: string | null;
  paymentTypeEnum?: PaymentTypeEnum;
  paymentType?: PaymentType;
  paymentMethodEnum?: PaymentMethodEnum;
  foreignCurrencyId?: number | null;
  foreignCurrencyAmount?: number | null;
  isPosted?: boolean | null;
  paymentMethod?: PaymentMethod;
  parentPaymentId?: number | null;
  districtId?: number | null;
  branchId?: number | null;
  originalReferenceNo?: string | null;
  paymentReceiptNo?: string | null;
  note?: string | null;
  generalLedgerEnum?: GeneralLedgerTypeEnum;
};
export type SubscriptionTypeEnum = 1 | 2 | 3 | 4 | 5;
export type SubscriptionType = {
  value?: SubscriptionTypeEnum;
  displayName?: string | null;
  description?: string | null;
};
export type IDomainEvent = object;
export type ShareHolderCategory = 1 | 2;
export type Gender = 1 | 2;
export type ShareholderTypeEnum = 1 | 2 | 3 | 4 | 5;
export type ShareholderType = {
  value?: ShareholderTypeEnum;
  displayName?: string | null;
  description?: string | null;
};
export type ShareholderStatusEnum = 1 | 2 | 3 | 4 | 5;
export type ShareholderStatus = {
  value?: ShareholderStatusEnum;
  name?: string | null;
  description?: string | null;
};
export type RepresentativeAddress = {
  countryId?: number;
  city?: string | null;
  subCity?: string | null;
  kebele?: string | null;
  woreda?: string | null;
  houseNumber?: string | null;
};
export type Country = {
  id?: number;
  name?: string | null;
  code?: string | null;
  nationality?: string | null;
  displayOrder?: number;
};
export type Address = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  countryId?: number;
  city?: string | null;
  subCity?: string | null;
  kebele?: string | null;
  woreda?: string | null;
  houseNumber?: string | null;
  shareholderId?: number;
  country?: Country;
  shareholder?: Shareholder;
};
export type ContactType = 1 | 2 | 3 | 4 | 5;
export type Contact = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  workflowComment?: string | null;
  versionNumber?: string;
  skipStateTransitionCheck?: boolean;
  domainEvents?: IDomainEvent[] | null;
  shareholderId?: number;
  type?: ContactType;
  value?: string | null;
  shareholder?: Shareholder;
};
export type PaymentUnit = 1 | 2;
export type PremiumRange = {
  upperBound?: number | null;
  percentage?: number;
};
export type SubscriptionPremium = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  isDefault?: boolean | null;
  ranges?: PremiumRange[] | null;
};
export type AllocationSubscriptionSummary = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  allocationId?: number;
  totalApprovedSubscriptions?: number;
  totalPendingApprovalSubscriptions?: number;
  totalApprovedPayments?: number;
  totalPendingApprovalPayments?: number;
  asOf?: string;
  allocation?: Allocation;
};
export type Allocation = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  workflowComment?: string | null;
  versionNumber?: string;
  skipStateTransitionCheck?: boolean;
  domainEvents?: IDomainEvent[] | null;
  name?: string | null;
  amount?: number;
  fromDate?: string;
  toDate?: string | null;
  allocationType?: AllocationType;
  description?: string | null;
  isOnlyForExistingShareholders?: boolean | null;
  isDividendAllocation?: boolean;
  subscriptionSummary?: AllocationSubscriptionSummary;
  allocationTotalPaidUp?: number;
  allocationRemaining?: number;
  allocationPending?: number;
  allocationReversal?: number;
  subscriptionGroups?: SubscriptionGroup[] | null;
};
export type SubscriptionGroup = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  name?: string | null;
  allocationID?: number;
  subscriptionPremiumId?: number | null;
  minFirstPaymentAmount?: number | null;
  minFirstPaymentAmountUnit?: PaymentUnit;
  expireDate?: string | null;
  minimumSubscriptionAmount?: number;
  description?: string | null;
  isDividendCapitalization?: boolean | null;
  isActive?: boolean;
  subscriptionPremium?: SubscriptionPremium;
  allocation?: Allocation;
  subscriptions?: Subscription[] | null;
};
export type District = {
  id?: number;
  districtName?: string | null;
  districtCode?: string | null;
};
export type SubscriptionPaymentSummary = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  subscriptionId?: number;
  totalApprovedPayments?: number;
  totalPendingApprovalPayments?: number;
  asOf?: string;
  subscription?: Subscription;
};
export type ForeignCurrencyType = {
  id?: number;
  name?: string | null;
  description?: string | null;
  displayOrder?: number;
};
export type SubscriptionPaymentReceipt = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  paymentId?: number;
  documentId?: string | null;
  isImage?: boolean;
  fileName?: string | null;
};
export type Share = {
  serialNumber?: number;
  parValue?: number;
  paymentId?: number | null;
  bankAllocationVersionNumber?: string;
  payment?: Payment;
};
export type PaymentsWeightedAverage = {
  id?: number;
  paymentId?: number;
  shareholderId?: number;
  dividendSetupId?: number;
  amount?: number;
  effectiveDate?: string;
  endDate?: string | null;
  workingDays?: number;
  weightedAverageAmt?: number;
  payment?: Payment;
};
export type Payment = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  workflowComment?: string | null;
  versionNumber?: string;
  skipStateTransitionCheck?: boolean;
  domainEvents?: IDomainEvent[] | null;
  amount?: number;
  subscriptionId?: number;
  effectiveDate?: string;
  endDate?: string | null;
  paymentTypeEnum?: PaymentTypeEnum;
  paymentType?: PaymentType;
  paymentMethodEnum?: PaymentMethodEnum;
  foreignCurrencyId?: number | null;
  foreignCurrencyAmount?: number | null;
  isPosted?: boolean | null;
  paymentMethod?: PaymentMethod;
  parentPaymentId?: number | null;
  districtId?: number | null;
  branchId?: number | null;
  originalReferenceNo?: string | null;
  paymentReceiptNo?: string | null;
  note?: string | null;
  generalLedgerEnum?: GeneralLedgerTypeEnum;
  district?: District;
  branch?: Branch;
  foreignCurrency?: ForeignCurrencyType;
  subscription?: Subscription;
  parentPayment?: Payment;
  receipts?: SubscriptionPaymentReceipt[] | null;
  shares?: Share[] | null;
  paymentsWeightedAverages?: PaymentsWeightedAverage[] | null;
};
export type Subscription = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  workflowComment?: string | null;
  versionNumber?: string;
  skipStateTransitionCheck?: boolean;
  domainEvents?: IDomainEvent[] | null;
  amount?: number;
  subscriptionDate?: string;
  subscriptionPaymentDueDate?: string;
  shareholderId?: number;
  subscriptionGroupID?: number;
  subscriptionDistrictID?: number | null;
  subscriptionBranchID?: number | null;
  dividendDescisionId?: number | null;
  subscriptionOriginalReferenceNo?: string | null;
  premiumPaymentReceiptNo?: string | null;
  subscriptionType?: SubscriptionTypeEnum;
  type?: SubscriptionType;
  premiumPayment?: number | null;
  isPosted?: boolean | null;
  shareholder?: Shareholder;
  subscriptionGroup?: SubscriptionGroup;
  district?: District;
  branch?: Branch;
  subscriptionSummary?: SubscriptionPaymentSummary;
  payments?: Payment[] | null;
};
export type DocumentType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14;
export type ShareholderDocument = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  shareholderId?: number;
  documentType?: DocumentType;
  documentId?: string | null;
  fileName?: string | null;
};
export type ShareholderFamily = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  shareholderId?: number;
  familyId?: number;
  shareholder?: Shareholder;
  family?: Family;
};
export type Family = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  name?: string | null;
  shareholderFamilies?: ShareholderFamily[] | null;
  members?: Shareholder[] | null;
};
export type ShareholderComment = {
  id?: number;
  shareholderId?: number;
  commentType?: string | null;
  commentedByUserId?: string | null;
  commentedBy?: string | null;
  text?: string | null;
  date?: string;
  shareholder?: Shareholder;
};
export type CertficateType = {
  value?: CertificateIssuanceTypeEnum;
  name?: string | null;
  description?: string | null;
};
export type CertificateAttachments = {
  documentId?: string | null;
  isImage?: boolean;
  fileName?: string | null;
};
export type Certficate = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  workflowComment?: string | null;
  versionNumber?: string;
  skipStateTransitionCheck?: boolean;
  domainEvents?: IDomainEvent[] | null;
  id?: number;
  certificateNo?: string | null;
  serialNumberRange?: string | null;
  paymentMethod?: PaymentMethod;
  paymentMethodEnum?: PaymentMethodEnum;
  certficateType?: CertficateType;
  certificateIssuanceTypeEnum?: CertificateIssuanceTypeEnum;
  shareholderId?: number;
  issueDate?: string;
  paidupAmount?: number;
  receiptNo?: string | null;
  isActive?: boolean;
  isPrinted?: boolean;
  note?: string | null;
  attachments?: CertificateAttachments[] | null;
  shareholder?: Shareholder;
};
export type Shareholder = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  workflowComment?: string | null;
  versionNumber?: string;
  skipStateTransitionCheck?: boolean;
  domainEvents?: IDomainEvent[] | null;
  shareholderNumber?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicName?: string | null;
  shareHolderCategory?: ShareHolderCategory;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  gender?: Gender;
  dateOfBirth?: string | null;
  countryOfCitizenship?: number;
  ethiopianOrigin?: boolean | null;
  passportNumber?: string | null;
  shareholderType?: ShareholderTypeEnum;
  type?: ShareholderType;
  shareholderStatus?: ShareholderStatusEnum;
  status?: ShareholderStatus;
  accountNumber?: string | null;
  tinNumber?: string | null;
  fileNumber?: string | null;
  isNew?: boolean | null;
  isBlocked?: boolean;
  isOtherBankMajorShareholder?: boolean;
  hasRelatives?: boolean;
  registrationDate?: string;
  representativeName?: string | null;
  representativeEmail?: string | null;
  representativePhoneNumber?: string | null;
  representativeAddress?: RepresentativeAddress;
  addresses?: Address[] | null;
  contacts?: Contact[] | null;
  subscriptions?: Subscription[] | null;
  shareholderDocuments?: ShareholderDocument[] | null;
  families?: Family[] | null;
  shareholderComments?: ShareholderComment[] | null;
  shareholderFamilies?: ShareholderFamily[] | null;
  certficates?: Certficate[] | null;
};
export type SubscriptionInfo = {
  id?: number;
  amount?: number;
  subscriptionDate?: string;
  subscriptionPaymentDueDate?: string;
  shareholderId?: number;
  subscriptionGroupID?: number;
  subscriptionDistrictID?: number | null;
  subscriptionBranchID?: number | null;
  subscriptionOriginalReferenceNo?: string | null;
  premiumPaymentReceiptNo?: string | null;
  subscriptionType?: SubscriptionTypeEnum;
  type?: SubscriptionType;
  premiumPayment?: number | null;
  isPosted?: boolean | null;
  shareholder?: Shareholder;
  subscriptionGroup?: SubscriptionGroup;
  district?: District;
  branch?: Branch;
};
export type GeneralLedgerDto = {
  glNumber?: string | null;
  value?: GeneralLedgerTypeEnum;
  description?: string | null;
  accountType?: string | null;
  transactionType?: string | null;
};
export type EodReconciliationDto = {
  id?: number;
  transactionReferenceNumber?: string | null;
  glNumber?: string | null;
  smsPaymentAmount?: number | null;
  smsPremiumAmount?: number | null;
  cbsAmount?: number | null;
  difference?: number | null;
  branchName?: string | null;
  endOfDay?: EndOfDayDto;
};
export type DailyTransactionListResponse = {
  totalItems?: number;
  totalCoreItems?: number;
  pageSize?: number;
  pageNumber?: number;
  totalAmount?: number;
  totalRubiTransactionAmount?: number;
  totalPremiumAmount?: number | null;
  totalTransferServiceCharge?: number;
  shareSaleAmount?: number | null;
  paymentGL?: string | null;
  premiumGL?: string | null;
  shareSaleGL?: string | null;
  branchList?: BranchDto[] | null;
  paymentList?: PaymentInfo[] | null;
  subscriptionList?: SubscriptionInfo[] | null;
  endOfDayDtoList?: EndOfDayDto[] | null;
  generalLedgerList?: GeneralLedgerDto[] | null;
  rigsTransactions?: RigsTransaction[] | null;
  eodReconciliationDtos?: EodReconciliationDto[] | null;
};
export type CountryDto = {
  id?: number;
  code?: string | null;
  name?: string | null;
  nationality?: string | null;
  displayOrder?: number;
};
export type DistrictDto = {
  id?: number;
  districtName?: string | null;
  districtCode?: string | null;
};
export type TransferTypeEnum = 1 | 2 | 3 | 4 | 5;
export type TransferType = {
  value?: TransferTypeEnum;
  displayName?: string | null;
  description?: string | null;
};
export type TransferDividendTermEnum = 1 | 2 | 3;
export type TransferDividendTerm = {
  value?: TransferDividendTermEnum;
  displayName?: string | null;
  description?: string | null;
};
export type ForeignCurrencyDto = {
  id?: number;
  name?: string | null;
  description?: string | null;
  displayOrder?: number;
};
export type ShareholderBlockType = {
  id?: number;
  name?: string | null;
  description?: string | null;
};
export type ShareholderBlockReason = {
  id?: number;
  name?: string | null;
  description?: string | null;
};
export type LookupsDto = {
  shareholderTypes?: ShareholderType[] | null;
  countries?: CountryDto[] | null;
  paymentTypes?: PaymentType[] | null;
  branch?: BranchDto[] | null;
  district?: DistrictDto[] | null;
  transferTypes?: TransferType[] | null;
  transferDividendTerms?: TransferDividendTerm[] | null;
  paymentMethods?: PaymentMethod[] | null;
  foreignCurrencyTypes?: ForeignCurrencyDto[] | null;
  shareholderStatuses?: ShareholderStatus[] | null;
  shareholderBlockTypes?: ShareholderBlockType[] | null;
  shareholderBlockReasons?: ShareholderBlockReason[] | null;
  currentDividendPeriod?: DividendPeriodDto;
  certficateTypes?: CertficateType[] | null;
};
export type ApproveParValueCommand = {
  id?: number;
  comment?: string | null;
};
export type CreateParValueCommand = {
  amount?: number;
  name?: string | null;
  description?: string | null;
};
export type ParValueDto = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  amount?: number;
  name?: string | null;
  description?: string | null;
};
export type ParValues = {
  approved?: ParValueDto[] | null;
  submitted?: ParValueDto[] | null;
  rejected?: ParValueDto[] | null;
  draft?: ParValueDto[] | null;
};
export type RejectParValueCommand = {
  id?: number;
  comment?: string | null;
};
export type SubmitParValueApprovalRequestCommand = {
  id?: number;
  comment?: string | null;
};
export type UpdateParValueCommand = {
  id?: number;
  amount?: number;
  name?: string | null;
  description?: string | null;
};
export type NewPaymentDto = {
  amount?: number;
  subscriptionId?: number;
  generalLedgerId?: GeneralLedgerTypeEnum;
  paymentDate?: string;
  paymentType?: PaymentTypeEnum;
  paymentMethod?: PaymentMethodEnum;
  foreignCurrencyId?: number | null;
  foreignCurrencyAmount?: number | null;
  districtId?: number | null;
  branchId?: number | null;
  originalReferenceNo?: string | null;
  paymentReceiptNo?: string | null;
  note?: string | null;
  parentPaymentId?: number | null;
};
export type MakeSubscriptionPaymentCommand = {
  payment?: NewPaymentDto;
};
export type AddPaymentAdjustmentCommand = {
  parentPaymentId?: number;
  amount?: number;
  paymentType?: PaymentTypeEnum;
  branchId?: number | null;
  districtId?: number | null;
  note?: string | null;
};
export type SubscriptionPaymentReceiptDto = {
  id?: number;
  paymentId?: number;
  documentId?: string | null;
  isImage?: boolean;
  fileName?: string | null;
};
export type SubscriptionPaymentDto = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  amount?: number;
  subscriptionId?: number;
  effectiveDate?: string;
  endDate?: string | null;
  paymentTypeEnum?: PaymentTypeEnum;
  paymentMethodEnum?: PaymentMethodEnum;
  foreignCurrencyId?: number | null;
  foreignCurrencyAmount?: number | null;
  transferId?: number | null;
  districtId?: number | null;
  branchId?: number | null;
  originalReferenceNo?: string | null;
  paymentReceiptNo?: string | null;
  note?: string | null;
  parentPaymentId?: number | null;
  hasChildPayment?: boolean;
  isReadOnly?: boolean;
  parentPayment?: SubscriptionPaymentDto;
  receipts?: SubscriptionPaymentReceiptDto[] | null;
  unapprovedTransfers?: SubscriptionPaymentDto[] | null;
  unapprovedAdjustments?: SubscriptionPaymentDto[] | null;
};
export type SubscriptionPayments = {
  approved?: SubscriptionPaymentDto[] | null;
  submitted?: SubscriptionPaymentDto[] | null;
  rejected?: SubscriptionPaymentDto[] | null;
  draft?: SubscriptionPaymentDto[] | null;
};
export type UpdateSubscriptionPaymentCommand = {
  id?: number;
  amount?: number;
  subscriptionId?: number;
  paymentDate?: string;
  paymentType?: PaymentTypeEnum;
  paymentMethod?: PaymentMethodEnum;
  foreignCurrencyId?: number | null;
  foreignCurrencyAmount?: number | null;
  districtId?: number | null;
  branchId?: number | null;
  originalReferenceNo?: string | null;
  paymentReceiptNo?: string | null;
  note?: string | null;
};
export type UpdatePaymentAdjustmentCommand = {
  paymentId?: number;
  amount?: number;
  paymentType?: PaymentTypeEnum;
  branchId?: number | null;
  districtId?: number | null;
  note?: string | null;
};
export type AddressDto = {
  id?: number;
  countryId?: number;
  city?: string | null;
  subCity?: string | null;
  kebele?: string | null;
  woreda?: string | null;
  houseNumber?: string | null;
  shareholderId?: number;
};
export type ContactDto = {
  id?: number;
  shareholderId?: number;
  type?: ContactType;
  value?: string | null;
  description?: string | null;
};
export type ShareholderBasicInfo = {
  id?: number;
  shareholderNumber?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  accountNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender;
  ethiopianOrigin?: boolean | null;
  countryOfCitizenship?: number;
  passportNumber?: string | null;
  type?: ShareholderType;
  shareholderType?: ShareholderTypeEnum;
  shareholderStatus?: ShareholderStatusEnum;
  status?: ShareholderStatus;
  approvalStatus?: ApprovalStatus;
  tinNumber?: string | null;
  fileNumber?: string | null;
  isNew?: boolean;
  isOtherBankMajorShareholder?: boolean;
  hasRelatives?: boolean;
  registrationDate?: string;
  photoUrl?: string | null;
  photoId?: string | null;
  signatureId?: string | null;
  comments?: ShareholderComment[] | null;
};
export type FamilyDto = {
  id?: number;
  name?: string | null;
  members?: ShareholderBasicInfo[] | null;
};
export type ShareholderDetailsDto = {
  id?: number;
  shareholderNumber?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  accountNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender;
  ethiopianOrigin?: boolean | null;
  countryOfCitizenship?: number;
  passportNumber?: string | null;
  type?: ShareholderType;
  shareholderType?: ShareholderTypeEnum;
  shareholderStatus?: ShareholderStatusEnum;
  status?: ShareholderStatus;
  approvalStatus?: ApprovalStatus;
  tinNumber?: string | null;
  fileNumber?: string | null;
  isNew?: boolean;
  isOtherBankMajorShareholder?: boolean;
  hasRelatives?: boolean;
  registrationDate?: string;
  photoUrl?: string | null;
  photoId?: string | null;
  signatureId?: string | null;
  comments?: ShareholderComment[] | null;
  addresses?: AddressDto[] | null;
  contacts?: ContactDto[] | null;
  families?: FamilyDto[] | null;
};
export type UpdateShareholderCommand = {
  id?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  amharicName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  countryOfCitizenship?: number;
  ethiopianOrigin?: boolean | null;
  passportNumber?: string | null;
  shareholderType?: ShareholderTypeEnum;
  accountNumber?: string | null;
  tinNumber?: string | null;
  fileNumber?: string | null;
  isOtherBankMajorShareholder?: boolean;
  hasRelatives?: boolean;
  gender?: Gender;
  dateOfBirth?: string | null;
  registrationDate?: string;
};
export type DocumentMetadataDto = {
  id?: string | null;
};
export type ShareholderDocumentDto = {
  id?: number;
  shareholderId?: number;
  documentType?: DocumentType;
  documentId?: string | null;
  fileName?: string | null;
  createdAt?: string | null;
};
export type GetFamiliesRequest = {
  shareholderIds?: number[] | null;
};
export type AddFamilyMembersRequest = {
  familyId?: number | null;
  members?: number[] | null;
};
export type RemoveFamilyMembersRequest = {
  familyId?: number;
  shareholderId?: number;
};
export type ShareholderInfo = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  shareholderNumber?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  isBlocked?: boolean | null;
  gender?: Gender;
  dateOfBirth?: string | null;
  countryOfCitizenship?: number;
  ethiopianOrigin?: boolean | null;
  passportNumber?: string | null;
  shareholderType?: ShareholderTypeEnum;
  accountNumber?: string | null;
  shareholderStatus?: ShareholderStatusEnum;
  tinNumber?: string | null;
  fileNumber?: string | null;
  isNew?: boolean;
  hasActiveTransfer?: boolean;
  isOtherBankMajorShareholder?: boolean;
  hasRelatives?: boolean;
  registrationDate?: string;
  isCurrent?: boolean;
  photoId?: string | null;
  photoUrl?: string | null;
  signatureId?: string | null;
  representativeName?: string | null;
  representativeEmail?: string | null;
  representativePhoneNumber?: string | null;
  representativeAddress?: RepresentativeAddress;
  comments?: ShareholderComment[] | null;
};
export type Note = {
  text?: string | null;
};
export type ShareholderRecordVersions = {
  current?: string | null;
  approved?: string | null;
  submitted?: string | null;
  draft?: string | null;
  rejected?: string | null;
};
export type ShareholderChangeLogEntityType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10;
export type ChangeType = 1 | 2 | 3 | 4 | 5 | 6;
export type ShareholderChangeLogDto = {
  id?: number;
  shareholderId?: number;
  entityType?: ShareholderChangeLogEntityType;
  entityId?: number;
  changeType?: ChangeType;
};
export type CreateShareholderCommand = {
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  amharicName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  accountNumber?: string | null;
  gender?: Gender;
  countryOfCitizenship?: number;
  ethiopianOrigin?: boolean | null;
  passportNumber?: string | null;
  shareholderType?: ShareholderTypeEnum;
  tinNumber?: string | null;
  fileNumber?: string | null;
  isOtherBankMajorShareholder?: boolean;
  hasRelatives?: boolean;
  registrationDate?: string;
  dateOfBirth?: string | null;
};
export type ShareholderSummary = {
  id?: number;
  versionNumber?: string;
  displayName?: string | null;
  amharicDisplayName?: string | null;
  gender?: Gender;
  dateOfBirth?: string | null;
  countryOfCitizenship?: number;
  ethiopianOrigin?: boolean | null;
  type?: ShareholderType;
  accountNumber?: string | null;
  shareholderStatus?: ShareholderStatusEnum;
  status?: ShareholderStatus;
  approvalStatus?: ApprovalStatus;
  isCurrent?: boolean;
  tinNumber?: string | null;
  fileNumber?: string | null;
  isNew?: boolean;
  hasActiveTransfer?: boolean;
  photoId?: string | null;
  photoUrl?: string | null;
};
export type ShareholderSearchResult = {
  items?: ShareholderSummary[] | null;
  totalCount?: number;
};
export type ChangeWorkflowStatusEntityDto = {
  id?: number;
  note?: string | null;
};
export type ShareUnit = 1 | 2;
export type BlockShareholderCommand = {
  amount?: number | null;
  unit?: ShareUnit;
  description?: string | null;
  blockedTill?: string | null;
  isActive?: boolean | null;
  shareholderId?: number;
  blockTypeId?: number;
  blockReasonId?: number;
  effectiveDate?: string;
};
export type BlockedShareholderAttachmentDto = {
  documentId?: string | null;
  isImage?: boolean;
  fileName?: string | null;
};
export type ShareholderBlockDetail = {
  id?: number | null;
  amount?: number | null;
  unit?: ShareUnit;
  description?: string | null;
  blockedTill?: string | null;
  effectiveDate?: string;
  isActive?: boolean | null;
  shareholderId?: number;
  blockTypeId?: number;
  blockReasonId?: number;
  attachments?: BlockedShareholderAttachmentDto[] | null;
};
export type ShareholderCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type SaveShareholderRepresentativeCommand = {
  shareholderId?: number;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  address?: RepresentativeAddress;
};
export type UnBlockShareholderCommand = {
  shareholderId?: number;
  description?: string | null;
};
export type GetSubscriptionAllocationQuery = {
  id?: number;
  shareholderId?: number;
  subscriptionAllocationAmount?: number;
  expireDate?: string;
};
export type PremiumRangeDto = {
  upperBound?: number | null;
  percentage?: number;
};
export type SubscriptionPremiumDto = {
  id?: number;
  isDefault?: boolean | null;
  ranges?: PremiumRangeDto[] | null;
};
export type SubscriptionGroupInfo = {
  id?: number;
  allocationID?: number;
  subscriptionPremiumId?: number | null;
  minFirstPaymentAmount?: number | null;
  minFirstPaymentAmountUnit?: PaymentUnit;
  expireDate?: string | null;
  name?: string | null;
  minimumSubscriptionAmount?: number | null;
  description?: string | null;
  isActive?: boolean;
  isDividendCapitalization?: boolean | null;
  subscriptionPremium?: SubscriptionPremiumDto;
};
export type CreateSubscriptionGroupCommand = {
  subscriptionGroup?: SubscriptionGroupInfo;
};
export type UpdateSubscriptionGroupCommand = {
  subscriptionGroup?: SubscriptionGroupInfo;
};
export type AddSubscriptionCommand = {
  amount?: number;
  subscriptionDate?: string;
  subscriptionPaymentDueDate?: string;
  shareholderId?: number;
  subscriptionGroupID?: number;
  subscriptionDistrictID?: number;
  subscriptionBranchID?: number;
  subscriptionOriginalReferenceNo?: string | null;
  premiumPaymentReceiptNo?: string | null;
};
export type SubscriptionPaymentSummaryDto = {
  subscriptionId?: number;
  totalApprovedPayments?: number;
  totalPendingApprovalPayments?: number;
};
export type ShareholderSubscriptionDto = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  amount?: number;
  subscriptionDate?: string | null;
  subscriptionPaymentDueDate?: string;
  shareholderId?: number;
  subscriptionGroupID?: number;
  subscriptionDistrictID?: number | null;
  subscriptionBranchID?: number | null;
  subscriptionOriginalReferenceNo?: string | null;
  premiumPaymentReceiptNo?: string | null;
  premiumPayment?: number | null;
  paymentSummary?: SubscriptionPaymentSummaryDto;
};
export type UnapprovedPayment = {
  id?: number;
  subscriptionId?: number;
  status?: ApprovalStatus;
};
export type ShareholderSubscriptions = {
  approved?: ShareholderSubscriptionDto[] | null;
  submitted?: ShareholderSubscriptionDto[] | null;
  rejected?: ShareholderSubscriptionDto[] | null;
  draft?: ShareholderSubscriptionDto[] | null;
  unapprovedPayments?: UnapprovedPayment[] | null;
};
export type ShareholderSubscriptionsSummary = {
  totalSubscriptions?: number;
  totalPayments?: number;
  totalApprovedSubscriptions?: number;
  totalPendingApprovalSubscriptions?: number;
  totalApprovedPayments?: number;
  totalPendingApprovalPayments?: number;
};
export type SubscriptionDocumentDto = {
  id?: number;
  subscriptionId?: number;
  documentId?: string | null;
  documentType?: DocumentType;
  isImage?: boolean;
  fileName?: string | null;
};
export type UpdateSubscriptionCommand = {
  id?: number;
  amount?: number;
  subscriptionDate?: string;
  subscriptionPaymentDueDate?: string;
  shareholderId?: number;
  subscriptionGroupID?: number;
  subscriptionDistrictID?: number;
  subscriptionBranchID?: number;
  subscriptionOriginalReferenceNo?: string | null;
  premiumPaymentReceiptNo?: string | null;
};
export type TransferDocumentType = 1 | 2 | 3;
export type TransferredPaymentDto = {
  paymentId?: number;
  amount?: number;
};
export type TransfereeDetail = {
  shareholderId?: number;
  amount?: number;
  payments?: TransferredPaymentDto[] | null;
};
export type AddNewTransferCommand = {
  transferType?: TransferTypeEnum;
  dividendTerm?: TransferDividendTermEnum;
  fromShareholderId?: number;
  totalTransferAmount?: number;
  sellValue?: number | null;
  serviceCharge?: number | null;
  capitalGainTax?: number | null;
  effectiveDate?: string;
  agreementDate?: string;
  branchId?: number;
  districtId?: number;
  note?: string | null;
  transferees?: TransfereeDetail[] | null;
};
export type TransferredPayment = {
  paymentId?: number;
  amount?: number;
};
export type TransfereeDto = {
  shareholderId?: number;
  amount?: number;
  payments?: TransferredPayment[] | null;
  shareholder?: ShareholderBasicInfo;
  transferredAmount?: number;
};
export type TransferDocument = {
  id?: number;
  documentType?: TransferDocumentType;
  transferId?: number;
  documentId?: string | null;
  isImage?: boolean;
  fileName?: string | null;
};
export type TransferDto = {
  id?: number;
  transferType?: TransferTypeEnum;
  dividendTerm?: TransferDividendTermEnum;
  fromShareholderId?: number;
  fromShareholder?: ShareholderBasicInfo;
  totalTransferAmount?: number;
  totalTransferredAmount?: number;
  sellValue?: number | null;
  serviceCharge?: number | null;
  capitalGainTax?: number | null;
  effectiveDate?: string;
  agreementDate?: string;
  branchId?: number;
  districtId?: number;
  note?: string | null;
  approvalStatus?: ApprovalStatus;
  transferees?: TransfereeDto[] | null;
  transferDocuments?: TransferDocument[] | null;
};
export type TransferPayments = {
  shareholderId?: number;
  amount?: number;
};
export type SavePaymentTransfersCommand = {
  transferId?: number;
  paymentId?: number;
  payments?: TransferPayments[] | null;
};
export type UpdateTransferCommand = {
  transferId?: number;
  transferType?: TransferTypeEnum;
  dividendTerm?: TransferDividendTermEnum;
  totalTransferAmount?: number;
  sellValue?: number | null;
  serviceCharge?: number | null;
  capitalGainTax?: number | null;
  effectiveDate?: string;
  agreementDate?: string;
  branchId?: number;
  districtId?: number;
  note?: string | null;
  transferees?: TransfereeDetail[] | null;
};
export const {
  useActivateUserMutation,
  useChangePasswordMutation,
  useDeactivateUserMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useVerificationCodeMutation,
  useRegisterUserMutation,
  useGetRolesQuery,
  useLazyGetRolesQuery,
  useAddClaimsMutation,
  useUsersQuery,
  useLazyUsersQuery,
  useGetUserDetailQuery,
  useLazyGetUserDetailQuery,
  useAddUserRoleMutation,
  useRemoveUserRoleMutation,
  useGetAllAllocationsQuery,
  useLazyGetAllAllocationsQuery,
  useApproveAllocationMutation,
  useGetAllBankAllocationsQuery,
  useLazyGetAllBankAllocationsQuery,
  useApproveBankAllocationMutation,
  useRejectBankAllocationMutation,
  useSetBankAllocationMutation,
  useSubmitBankAllocationForApprovalMutation,
  useCreateAllocationMutation,
  useRejectAllocationMutation,
  useGetAllShareholderAllocationsQuery,
  useLazyGetAllShareholderAllocationsQuery,
  useSubmitAllocationForApprovalMutation,
  useGetAllocationSummariesQuery,
  useLazyGetAllocationSummariesQuery,
  useUpdateAllocationMutation,
  useGetShareholderCertificatesQuery,
  useLazyGetShareholderCertificatesQuery,
  useActivateCertificateMutation,
  useUploadCertificateIssueDocumentMutation,
  useDeactivateCertificateMutation,
  usePrepareShareholderCertificateMutation,
  useUpdateShareholderCertificateMutation,
  useGetShareholderDividendsQuery,
  useLazyGetShareholderDividendsQuery,
  useAddNewDividendSetupMutation,
  useApproveDividendSetupMutation,
  useComputeDividendRateMutation,
  useAttachDividendDecisionDocumentMutation,
  useGetDividendDecisionsSummaryQuery,
  useLazyGetDividendDecisionsSummaryQuery,
  useEvaluateDividendDecisionMutation,
  useGetDividendPeriodsQuery,
  useLazyGetDividendPeriodsQuery,
  useGetSetupDividendsQuery,
  useLazyGetSetupDividendsQuery,
  useGetSetupsQuery,
  useLazyGetSetupsQuery,
  useGetShareholderDividendDetailQuery,
  useLazyGetShareholderDividendDetailQuery,
  useSubmitDividendDecisionMutation,
  useTaxPendingDecisionsMutation,
  useUpdateDividendSetupMutation,
  useGetApiDocumentsByIdQuery,
  useLazyGetApiDocumentsByIdQuery,
  useDownloadDocumentQuery,
  useLazyDownloadDocumentQuery,
  useDocumentRootPathQuery,
  useLazyDocumentRootPathQuery,
  useExportToCsvFileMutation,
  useGetAllTransactionsQuery,
  useLazyGetAllTransactionsQuery,
  useGetCoreTransactionQuery,
  useLazyGetCoreTransactionQuery,
  useGetDailyTransactionsQuery,
  useLazyGetDailyTransactionsQuery,
  useProcessEodMutation,
  useGetAllLookupsQuery,
  useLazyGetAllLookupsQuery,
  useApproveParValueMutation,
  useCreateParValueMutation,
  useGetAllParValuesQuery,
  useLazyGetAllParValuesQuery,
  useRejectParValueMutation,
  useSubmitParValueForApprovalMutation,
  useUpdateParValueMutation,
  useUploadSubscriptionPaymentReceiptMutation,
  useMakePaymentMutation,
  useAddNewAdjustmentMutation,
  useGetSubscriptionPaymentsQuery,
  useLazyGetSubscriptionPaymentsQuery,
  useUpdatePaymentMutation,
  useUpdatePaymentAdjustmentMutation,
  useListOfActiveShareholdersReportQuery,
  useLazyListOfActiveShareholdersReportQuery,
  useActiveShareholderListForGaQuery,
  useLazyActiveShareholderListForGaQuery,
  useListofAddtionalSharePaymentsReportQuery,
  useLazyListofAddtionalSharePaymentsReportQuery,
  useBankAllocationsReportQuery,
  useLazyBankAllocationsReportQuery,
  useBranchPaymentReportQuery,
  useLazyBranchPaymentReportQuery,
  useBranchPaymentSummaryReportQuery,
  useLazyBranchPaymentSummaryReportQuery,
  useDividendDecisionsReportQuery,
  useLazyDividendDecisionsReportQuery,
  useDividendPaymentsReportQuery,
  useLazyDividendPaymentsReportQuery,
  useEndOfDayDailyReportQuery,
  useLazyEndOfDayDailyReportQuery,
  useExpiredSubscriptionsReportQuery,
  useLazyExpiredSubscriptionsReportQuery,
  useListOfForeignNationalShareholdersReportQuery,
  useLazyListOfForeignNationalShareholdersReportQuery,
  useListofFractionalPaidUpAmountsReportQuery,
  useLazyListofFractionalPaidUpAmountsReportQuery,
  useListOfNewShareholdersReportQuery,
  useLazyListOfNewShareholdersReportQuery,
  useListofNewPaymentsImpactingPaidUpGlReportQuery,
  useLazyListofNewPaymentsImpactingPaidUpGlReportQuery,
  useListofNewBranchPaymentsSummaryReportQuery,
  useLazyListofNewBranchPaymentsSummaryReportQuery,
  useOrganizationReportQuery,
  useLazyOrganizationReportQuery,
  useOutstandingAllocationsReportQuery,
  useLazyOutstandingAllocationsReportQuery,
  useOutstandingSubscriptionsReportQuery,
  useLazyOutstandingSubscriptionsReportQuery,
  usePaidUpBalanceReportQuery,
  useLazyPaidUpBalanceReportQuery,
  usePremiumCollectedReportQuery,
  useLazyPremiumCollectedReportQuery,
  useShareCertificateReportQuery,
  useLazyShareCertificateReportQuery,
  useShareholderDividendDecisionReportQuery,
  useLazyShareholderDividendDecisionReportQuery,
  useShareholderPaymentsReportQuery,
  useLazyShareholderPaymentsReportQuery,
  useShareholderAllocationsReportQuery,
  useLazyShareholderAllocationsReportQuery,
  useSubscriptionsReportQuery,
  useLazySubscriptionsReportQuery,
  useTopShareholderByPaidUpReportQuery,
  useLazyTopShareholderByPaidUpReportQuery,
  useTopSubscriptionsReportQuery,
  useLazyTopSubscriptionsReportQuery,
  useTransfersReportQuery,
  useLazyTransfersReportQuery,
  useUncollectedDividendReportQuery,
  useLazyUncollectedDividendReportQuery,
  useGetShareholderByIdQuery,
  useLazyGetShareholderByIdQuery,
  useUpdateShareholderMutation,
  useAddShareholderPhotoMutation,
  useAddShareholderSignatureMutation,
  useAddShareholderAddressMutation,
  useUpdateShareholderAddressMutation,
  useGetShareholderAddressesQuery,
  useLazyGetShareholderAddressesQuery,
  useAddShareholderContactMutation,
  useUpdateShareholderContactMutation,
  useGetShareholderContactsQuery,
  useLazyGetShareholderContactsQuery,
  useGetShareholderDocumentsQuery,
  useLazyGetShareholderDocumentsQuery,
  useGetFamiliesMutation,
  useAddFamilyMembersMutation,
  useRemoveFamilyMemberMutation,
  useGetShareholderInfoQuery,
  useLazyGetShareholderInfoQuery,
  useAddShareholderNoteMutation,
  useGetShareholderRecordVersionsQuery,
  useLazyGetShareholderRecordVersionsQuery,
  useGetShareholderChangeLogQuery,
  useLazyGetShareholderChangeLogQuery,
  useUploadShareholderDocumentMutation,
  useAddNewShareholderMutation,
  useGetAllShareholdersQuery,
  useLazyGetAllShareholdersQuery,
  useApproveShareholderMutation,
  useBlockShareholderMutation,
  useGetShareholderBlockDetailQuery,
  useLazyGetShareholderBlockDetailQuery,
  useUploadShareholderBlockDocumentMutation,
  useGetShareholderCountPerApprovalStatusQuery,
  useLazyGetShareholderCountPerApprovalStatusQuery,
  useRejectShareholderApprovalRequestMutation,
  useSaveShareholderRepresentativeMutation,
  useSubmitForApprovalMutation,
  useTypeaheadSearchQuery,
  useLazyTypeaheadSearchQuery,
  useUnBlockShareholderMutation,
  useGetSubscriptionAllocationByIdQuery,
  useLazyGetSubscriptionAllocationByIdQuery,
  useGetSubscriptionGroupByIdQuery,
  useLazyGetSubscriptionGroupByIdQuery,
  useGetAllSubscriptionGroupsQuery,
  useLazyGetAllSubscriptionGroupsQuery,
  useCreateSubscriptionGroupMutation,
  useUpdateSubscriptionGroupMutation,
  useAddSubscriptionMutation,
  useAttachPremiumPaymentReceiptMutation,
  useAttachSubscriptionFormMutation,
  useGetShareholderSubscriptionsQuery,
  useLazyGetShareholderSubscriptionsQuery,
  useGetShareholderSubscriptionSummaryQuery,
  useLazyGetShareholderSubscriptionSummaryQuery,
  useGetShareholderSubscriptionDocumentsQuery,
  useLazyGetShareholderSubscriptionDocumentsQuery,
  useUpdateSubscriptionMutation,
  useDeleteTransferMutation,
  useUploadTransferDocumentMutation,
  useCreateNewTransferMutation,
  useGetTransfersByShareholderIdQuery,
  useLazyGetTransfersByShareholderIdQuery,
  useSavePaymentTransfersMutation,
  useUpdateTransferMutation,
  useCurrentUserInfoQuery,
  useLazyCurrentUserInfoQuery,
} = injectedRtkApi;