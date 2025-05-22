import { useMemo } from "react";
import { useGetAllShareholderAllocationsQuery } from "../../app/api";
import { useSubscriptionGroups } from "../SubscriptionGroup";
import { useShareholderIdAndVersion } from "../shareholder";
import { useAllocations } from "./useAllocations";

export const useShareholderAllocations = () => {
  const { id: shareholderId } = useShareholderIdAndVersion();

  const { data } = useGetAllShareholderAllocationsQuery(
    {
      shareholderId: shareholderId!,
    },
    { skip: !shareholderId }
  );

  const { allocations } = useAllocations();
  const { subscriptionGroups } = useSubscriptionGroups();

  const { activeShareholderAllocations, shareholderAllocations } =
    useMemo(() => {
      const shareholderAllocations = data?.map((sa) => {
        const allocation = allocations?.approved?.find(
          (a) => a.id == sa.allocationId
        );
        const subscriptionGroupNames = subscriptionGroups
          ?.filter((sg) => sg.allocationID == allocation?.id)
          .map((sg) => sg.name || "")
          .join(", ");
        return {
          ...sa,
          isActive: !!allocation?.isActive,
          name: allocation?.name,
          subscriptionGroups: subscriptionGroupNames,
        };
      });
      const activeShareholderAllocations = shareholderAllocations?.filter(
        (x) => x.isActive
      );

      return { shareholderAllocations, activeShareholderAllocations };
    }, [allocations?.approved, data, subscriptionGroups]);

  return { activeShareholderAllocations, shareholderAllocations };
};
