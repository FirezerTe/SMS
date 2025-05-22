import { SxProps } from "@mui/material";
import { each, isObject, toLower, uniq, unset, upperFirst } from "lodash-es";
import * as yup from "yup";
import { ShareholderChangeLogDto } from "../app/api";
import {
  ApprovalStatus,
  ChangeType,
  DividendRateComputationStatus,
  Gender,
  PaymentMethod,
  PaymentType,
  PaymentUnit,
  ShareholderChangeLogEntityType,
  SubscriptionStatus,
  certficateType,
} from "../app/api/enums";

export type YupSchema<T> = T extends string
  ? yup.StringSchema
  : T extends number
  ? yup.NumberSchema
  : T extends boolean
  ? yup.BooleanSchema
  : T extends Record<any, any>
  ? yup.AnyObjectSchema
  : T extends any[]
  ? yup.ArraySchema<any, any>
  : yup.AnySchema;

export type YupShape<T extends object> = {
  [Key in keyof T]: YupSchema<T[Key]>;
};

export const AllowedAmharicCharacters = /^[\u1200-\u137C\s]*$/;

export const getGenderLabel = (gender?: Gender) => {
  switch (gender) {
    case Gender.Male:
      return "Male";
    case Gender.Female:
      return "Female";
    default:
      return "";
  }
};

export const getSubscriptionStatusLabel = (status?: SubscriptionStatus) => {
  switch (status) {
    case SubscriptionStatus.Pending:
      return "Pending";
    case SubscriptionStatus.Approved:
      return "Approved";
    case SubscriptionStatus.Returned:
      return "Returned";
    case SubscriptionStatus.Cancle:
      return "Cancle";
    case SubscriptionStatus.Reject:
      return "Reject";
    case SubscriptionStatus.Null:
      return "Null";
    case SubscriptionStatus.ReversePending:
      return "ReversePending";
    case SubscriptionStatus.ReverseApproved:
      return "ReverseApproved";
    case SubscriptionStatus.Reverse:
      return "Reverse";
    default:
      return "";
  }
};

export const removeEmptyFields = <T extends object>(
  value: T
): {
  [K in keyof T]: NonNullable<T[K]> | undefined;
} => {
  each(value, (v, k) => {
    if (["", undefined, null].some((x) => x === v)) {
      try {
        unset(value, k);
        // eslint-disable-next-line no-empty
      } catch (_) {}
    } else if (typeof v !== "string" && isObject(v)) {
      removeEmptyFields(v);
    }
  });

  return value as {
    [K in keyof T]: NonNullable<T[K] | undefined>;
  };
};

export const ApprovalStatusLabel: { [key in ApprovalStatus]: string } = {
  [ApprovalStatus.Approved]: "Approved",
  [ApprovalStatus.Draft]: "Draft",
  [ApprovalStatus.Rejected]: "Rejected",
  [ApprovalStatus.Submitted]: "Submitted",
};

export const PaymentMethodLabel: { [key in PaymentMethod]: string } = {
  [PaymentMethod.FromAccount]: "From Account",
  [PaymentMethod.Cash]: "Cash",
  [PaymentMethod.Check]: "Check",
  [PaymentMethod.DividendCapitalization]: "Dividend Capitalization",
  [PaymentMethod.Transfer]: "Transfer",
  [PaymentMethod.CreditCard]: "CreditCard",
  [PaymentMethod.Other]: "Other",
};

export const PaymentTypeLabel: { [key in PaymentType]: string } = {
  [PaymentType.Correction]: "Correction",
  [PaymentType.DividendCapitalize]: "Dividend",
  [PaymentType.Reversal]: "Reversal",
  [PaymentType.SubscriptionPayment]: "Subscription",
  [PaymentType.TransferPayment]: "Transfer",
};

export const PaymentUnitLabel: { [key in PaymentUnit]: string } = {
  [PaymentUnit.Percentage]: "%",
  [PaymentUnit.Birr]: "Birr",
};

export const isAdjustmentPaymentType = (type?: PaymentType) =>
  type == PaymentType.Correction || type == PaymentType.Reversal;

export const shareholderChangeLogLabel = ({
  entityType,
  changeType,
}: ShareholderChangeLogDto) => {
  if (ShareholderChangeLogEntityType.BasicInfo === entityType)
    return `${
      (changeType === ChangeType.Added && "New ") || ""
    }Basic Information ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (ShareholderChangeLogEntityType.Payment === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Payment ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (ShareholderChangeLogEntityType.Subscription === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Subscription ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (ShareholderChangeLogEntityType.Transfer === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Transfer ${
      (changeType === ChangeType.Added && "Added") ||
      (changeType === ChangeType.Deleted && "Deleted") ||
      "Modified"
    }`;

  if (ShareholderChangeLogEntityType.Blocked === entityType)
    return `Shareholder Blocked`;

  if (ShareholderChangeLogEntityType.Unblocked === entityType)
    return `Shareholder Unblocked`;

  if (ShareholderChangeLogEntityType.Contact === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Contact ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (ShareholderChangeLogEntityType.Address === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Address ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (ShareholderChangeLogEntityType.DividendDecision === entityType)
    return `Dividend Decision Updated`;
  if (ShareholderChangeLogEntityType.Certificate === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Certificate ${
      (changeType === ChangeType.Added && "Added") || "Deactivated"
    }`;
};

export const shareholderChangeLogsLabels = (logs?: ShareholderChangeLogDto[]) =>
  uniq(
    (logs || []).map((log) =>
      upperFirst(toLower(shareholderChangeLogLabel(log)))
    )
  );

export const modifiedStyle = {
  borderStyle: "solid",
  borderColor: "warning.main",
  borderWidth: 0,
  borderLeftWidth: 5,
  borderRadius: 2,
  boxSizing: "border-box",
  p: 1,
};
export const addedStyle = {
  borderStyle: "solid",
  borderColor: "success.main",
  borderWidth: 0,
  borderLeftWidth: 5,
  borderRadius: 2,
  boxSizing: "border-box",
  p: 1,
};
// export const modifiedStyle = { borderStyle: 'dotted', borderColor: 'warning.main', borderWidth: 2, borderRadius: 2, boxSizing: "border-box", p: 1 };
// export const addedStyle = { borderStyle: 'dotted', borderColor: 'success.main', borderWidth: 2, borderRadius: 2, boxSizing: "border-box", p: 1 };
export const getChangelogStyle = (
  changeLog?: ShareholderChangeLogDto
): SxProps | undefined =>
  !changeLog
    ? undefined
    : changeLog?.changeType === ChangeType.Added
    ? addedStyle
    : modifiedStyle;

export const DividendRateComputationStatusLabel: {
  [key in DividendRateComputationStatus]: string;
} = {
  [DividendRateComputationStatus.Completed]: "Completed",
  [DividendRateComputationStatus.CompletedWithError]: "Completed With Error",
  [DividendRateComputationStatus.Computing]: "Computing",
  [DividendRateComputationStatus.NotStarted]: "Computation not started",
};
export const CertificateTypeLabel: { [key in certficateType]: string } = {
  [certficateType.Amalgamation]: "Amalgamation",
  [certficateType.Incremental]: "Incremental",
  [certficateType.Replacement]: "Replacement",
};
