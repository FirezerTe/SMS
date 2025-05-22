import { useGetShareholderSubscriptionsQuery } from "../../app/api";
import { useShareholderIdAndVersion } from "../shareholder";

export const useShareholderSubscriptions = () => {
  const { id } = useShareholderIdAndVersion();

  const { data } = useGetShareholderSubscriptionsQuery(
    {
      id,
    },
    { skip: !id }
  );

  return {
    subscriptions: data,
    hasApprovedSubscription: !!data?.approved?.length,
  };
};
