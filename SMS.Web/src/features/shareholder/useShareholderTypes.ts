import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useShareholderTypes = () => {
  const { data } = useGetAllLookupsQuery();

  const { shareholderTypeLookups, paymentMethods } = useMemo(() => {
    const shareholderTypeLookups = (
      data?.shareholderTypes || []
    ).map<SelectOption>(({ value, displayName }) => ({
      label: displayName || "",
      value: value,
    }));
    return {
      shareholderTypeLookups,
      paymentMethods: data?.shareholderTypes || [],
    };
  }, [data]);
  return {
    paymentMethods,
    shareholderTypeLookups,
  };
};
