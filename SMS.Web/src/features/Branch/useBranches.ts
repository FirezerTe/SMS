import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useBranches = () => {
  const { data } = useGetAllLookupsQuery();

  const { branchLookups, branches } = useMemo(() => {
    const branchLookups = (data?.branch || []).map<SelectOption>(
      ({ id, branchName, branchCode }) => ({
        label: branchName || branchCode || "",
        value: id,
      })
    );

    return { branchLookups, branches: data?.branch || [] };
  }, [data]);
  return {
    branches,
    branchLookups,
  };
};
