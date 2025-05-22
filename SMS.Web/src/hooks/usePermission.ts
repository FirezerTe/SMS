import { useCallback, useMemo } from "react";
import { useCurrentUserInfoQuery } from "../app/api";
import { Permission } from "../app/api/enums";

export const usePermission = () => {
  const { data } = useCurrentUserInfoQuery();

  const hasPermission = useCallback(
    (permission: Permission) => {
      return !!data?.permissions?.some(
        (x) => x.name === permission && x.hasPermission
      );
    },
    [data?.permissions]
  );

  const permissions = useMemo(() => {
    const canCreateOrUpdateAllocation = hasPermission(
      Permission.CanCreateOrUpdateAllocation
    );
    const canApproveAllocation = hasPermission(Permission.CanApproveAllocation);
    const canCreateOrUpdateBankAllocation = hasPermission(
      Permission.CanCreateOrUpdateBankAllocation
    );
    const canApproveBankAllocation = hasPermission(
      Permission.CanApproveBankAllocation
    );
    const canCreateOrUpdateDividendSetup = hasPermission(
      Permission.CanCreateOrUpdateDividendSetup
    );
    const canApproveDividendSetup = hasPermission(
      Permission.CanApproveDividendSetup
    );
    const canCreateOrUpdateParValue = hasPermission(
      Permission.CanCreateOrUpdateParValue
    );
    const canApproveParValue = hasPermission(Permission.CanApproveParValue);
    const canCreateOrUpdateSubscriptionGroup = hasPermission(
      Permission.CanCreateOrUpdateSubscriptionGroup
    );
    const canCreateOrUpdateShareholderInfo = hasPermission(
      Permission.CanCreateOrUpdateShareholderInfo
    );
    const canSubmitShareholderApprovalRequest = hasPermission(
      Permission.CanSubmitShareholderApprovalRequest
    );
    const canApproveShareholder = hasPermission(
      Permission.CanApproveShareholder
    );
    const canCreateOrUpdateSubscription = hasPermission(
      Permission.CanCreateOrUpdateSubscription
    );
    const canCreateOrUpdatePayment = hasPermission(
      Permission.CanCreateOrUpdatePayment
    );
    const canCreateOrUpdateTransfer = hasPermission(
      Permission.CanCreateOrUpdateTransfer
    );

    const canCreateOrUpdateUser = hasPermission(
      Permission.CanCreateOrUpdateUser
    );

    const canProcessEndOfDay = hasPermission(Permission.CanProcessEndOfDay);
    return {
      canCreateOrUpdateAllocation,
      canApproveAllocation,
      canCreateOrUpdateBankAllocation,
      canApproveBankAllocation,
      canCreateOrUpdateDividendSetup,
      canApproveDividendSetup,
      canCreateOrUpdateParValue,
      canApproveParValue,
      canCreateOrUpdateSubscriptionGroup,
      canCreateOrUpdateShareholderInfo,
      canSubmitShareholderApprovalRequest,
      canApproveShareholder,
      canCreateOrUpdateSubscription,
      canCreateOrUpdatePayment,
      canCreateOrUpdateTransfer,
      canCreateOrUpdateUser,
      canProcessEndOfDay,
    };
  }, [hasPermission]);

  return permissions;
};
