import { useMemo } from "react";
import { useAllocations, useShareholderAllocations } from "../Allocation";
import { useSubscriptionGroups } from "../SubscriptionGroup";

export const useApplicableSubscriptionGroupLookups = () => {
  const { subscriptionGroupLookups, subscriptionGroups } =
    useSubscriptionGroups();

  const { allocations } = useAllocations();
  const { shareholderAllocations } = useShareholderAllocations();

  const applicableSubscriptionGroupLookups = useMemo(() => {
    if (!allocations?.approved?.length) return [];

    const applicableSubscriptionGroup = subscriptionGroups?.filter((x) => {
      const allocation = allocations.approved?.find((a) => a.id === x.id);
      if (!allocation?.isOnlyForExistingShareholders) return true;

      return shareholderAllocations?.some(
        (sa) => sa.allocationId == x.allocationID
      );
    });

    return (
      subscriptionGroupLookups.filter((lookup) =>
        applicableSubscriptionGroup?.some((sg) => sg.id == lookup.value)
      ) || []
    );
  }, [
    allocations,
    shareholderAllocations,
    subscriptionGroupLookups,
    subscriptionGroups,
  ]);

  return { applicableSubscriptionGroupLookups };
};
