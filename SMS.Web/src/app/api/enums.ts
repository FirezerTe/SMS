export enum Gender {
  Male = 1,
  Female = 2,
}

export enum ApprovalStatus {
  Draft = 1,
  Submitted = 2,
  Rejected = 3,
  Approved = 4,
}

export enum ContactType {
  Email = 1,
  CellPhone = 2,
  HomePhone = 3,
  WorkPhone = 4,
  Fax = 5,
}

export enum DocumentType {
  ShareholderPicture = 1,
  ShareholderSignature = 2,
  SubscriptionForm = 3,
  PaymentReceipt = 4,
  TransferForm = 5,
  SubscriptionPremiumPaymentReceipt = 6,
  ArticlesOfOrganizationOrCertificate = 7,
  OperationalAgreement = 8,
  PhotoIdentification = 9,
  DrivingLicense = 10,
  Passport = 11,
  BirthCertificate = 12,
  MarriageCertificate = 13,
  Other = 14,
}

export enum ShareholderType {
  Individual = 1,
  Organization = 2,
  Association = 3,
  Church = 4,
  Edir = 5,
}

export enum ShareholderStatus {
  Active = 1,
  Inactive = 2,
  Blocked = 3,
}

export enum ShareUnit {
  Share = 1,
  Birr = 2,
}

export enum AllocationStatus {
  Pending = 1,
  Approved = 2,
  Returned = 3,
  Cancle = 4,
  Active = 5,
  Inactive = 6,
  Discard = 7,
}

export enum SubscriptionStatus {
  Pending = 1,
  Approved = 2,
  Returned = 3,
  Cancle = 4,
  Reverse = 5,
  Posted = 6,
  Null = 0,
  Save = 8,
  Reject = 9,
  ReverseApproved = 10,
  ReversePending = 11,
  Discard = 12,
}

export enum PaymentType {
  SubscriptionPayment = 1,
  DividendCapitalize = 2,
  TransferPayment = 3,
  Reversal = 4,
  Correction = 5,
}

export enum PaymentMethod {
  FromAccount = 1,
  Cash = 2,
  Check = 3,
  DividendCapitalization = 4,
  Transfer = 5,
  CreditCard = 6,
  Other = 7,
}

export enum PaymentUnit {
  Percentage = 1,
  Birr = 2,
}

export enum TransferDividendTerm {
  FullToTransferor = 1,
  FullToTransferee = 2,
  Shared = 3,
}

export enum TransferType {
  Inheritance = 1,
  Gift = 2,
  Split = 3,
  Sale = 4,
  CourtOrder = 5,
}

export enum TransferDocumentType {
  Agreement = 1,
  CapitalGainTaxReceipt = 2,
  Unspecified = 3,
}

export enum ShareholderChangeLogEntityType {
  BasicInfo = 1,
  Payment = 2,
  Subscription = 3,
  Transfer = 4,
  Blocked = 5,
  Unblocked = 6,
  Contact = 7,
  Address = 8,
  DividendDecision = 9,
  Certificate = 10,
}

export enum ChangeType {
  Added = 1,
  Modified = 2,
  Deleted = 3,
  Blocked = 4,
  Unblocked = 5,
}

export enum DividendDecisionType {
  FullyCapitalize = 1,
  FullyPay = 2,
  PartiallyCapitalize = 3,
  Pending = 4,
}

export enum DividendDecisionDocumentType {
  SignedForm = 1,
  FulfillmentPaymentReceipt = 2,
}

export enum DividendDistributionStatus {
  NotStarted = 1,
  Started = 2,
  Completed = 3,
  CompletedWithError = 4,
}

export enum DividendRateComputationStatus {
  NotStarted = 1,
  Computing = 2,
  Completed = 3,
  CompletedWithError = 4,
}
export enum certficateType {
  Replacement = 1,
  Amalgamation = 2,
  Incremental = 3,
}

export enum Permission {
  CanCreateOrUpdateAllocation = "CanCreateOrUpdateAllocation",
  CanApproveAllocation = "CanApproveAllocation",
  CanCreateOrUpdateBankAllocation = "CanCreateOrUpdateBankAllocation",
  CanApproveBankAllocation = "CanApproveBankAllocation",
  CanCreateOrUpdateDividendSetup = "CanCreateOrUpdateDividendSetup",
  CanApproveDividendSetup = "CanApproveDividendSetup",
  CanCreateOrUpdateParValue = "CanCreateOrUpdateParValue",
  CanApproveParValue = "CanApproveParValue",
  CanCreateOrUpdateSubscriptionGroup = "CanCreateOrUpdateSubscriptionGroup",
  CanCreateOrUpdateShareholderInfo = "CanCreateOrUpdateShareholderInfo",
  CanSubmitShareholderApprovalRequest = "CanSubmitShareholderApprovalRequest",
  CanApproveShareholder = "CanApproveShareholder",
  CanCreateOrUpdateSubscription = "CanCreateOrUpdateSubscription",
  CanCreateOrUpdatePayment = "CanCreateOrUpdatePayment",
  CanCreateOrUpdateTransfer = "CanCreateOrUpdateTransfer",
  CanCreateOrUpdateUser = "CanCreateOrUpdateUser",
  CanProcessEndOfDay = "CanProcessEndOfDay",
}
