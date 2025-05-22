import { useCallback, useMemo } from "react";
import { useGetAllSubscriptionGroupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useSubscriptionGroups = () => {
  const { data: subscriptionGroups } = useGetAllSubscriptionGroupsQuery();

  const subscriptionGroupLookups = useMemo(
    () =>
      (subscriptionGroups || []).map<SelectOption>(
        ({ id, name, isActive, isDividendCapitalization }) => ({
          label: name || "",
          value: id,
          isInactive: !isActive || !!isDividendCapitalization,
        })
      ),
    [subscriptionGroups]
  );

  const computePremiumPayment = useCallback(
    (subscriptionAmount: number, subscriptionGroupId: number) => {
      const subscriptionGroup = subscriptionGroups?.find(
        (s) => s.id === subscriptionGroupId
      );
      if (!subscriptionGroup?.subscriptionPremium?.ranges?.length) return 0;

      const potentialRanges = subscriptionGroup.subscriptionPremium.ranges
        .filter((x) => !!x.upperBound && x.upperBound >= subscriptionAmount)
        .sort((a, b) => a.upperBound! - b.upperBound!);

      const applicableRange = potentialRanges.length
        ? potentialRanges[0]
        : subscriptionGroup.subscriptionPremium.ranges.find(
            (x) => x.upperBound === null || x.upperBound === undefined
          );

      const percent = applicableRange?.percentage || 0;

      return (percent * subscriptionAmount) / 100;
    },
    [subscriptionGroups]
  );

  return {
    subscriptionGroups,
    subscriptionGroupLookups,
    computePremiumPayment,
  };
};
