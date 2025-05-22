import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useTransferTypes = () => {
  const { data } = useGetAllLookupsQuery();

  const { transferTypeLookups, transferTypes } = useMemo(() => {
    const transferTypeLookups = (data?.transferTypes || []).map<SelectOption>(
      ({ value, displayName }) => ({
        label: displayName || "",
        value: value,
      })
    );
    return {
      transferTypeLookups,
      transferTypes: data?.transferTypes || [],
    };
  }, [data]);

  return {
    transferTypes,
    transferTypeLookups,
  };
};
