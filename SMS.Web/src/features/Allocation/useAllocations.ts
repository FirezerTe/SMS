import { useMemo } from "react";
import { useGetAllAllocationsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useAllocations = () => {
  const { data: allocations } = useGetAllAllocationsQuery();

  const approvedAllocationLookups = useMemo(
    () =>
      (allocations?.approved || []).map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      })),
    [allocations?.approved]
  );

  return { allocations, approvedAllocationLookups };
};
