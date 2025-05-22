import { useCallback, useMemo } from "react";
import { useGetAllLookupsQuery } from "../../../app/api";
import { SelectOption } from "../../../types";

export const useBlockTypes = () => {
  const { data: lookups } = useGetAllLookupsQuery();

  const getBlockType = useCallback(
    (id?: number | null) =>
      lookups?.shareholderBlockTypes?.find((r) => r.id == id) || undefined,
    [lookups?.shareholderBlockTypes]
  );

  const { blockTypeLookups, blockTypes } = useMemo(() => {
    const blockTypeLookups = (
      lookups?.shareholderBlockTypes || []
    ).map<SelectOption>(({ id, name }) => ({
      label: name || "",
      value: id,
    }));
    return {
      blockTypeLookups,
      blockTypes: lookups?.shareholderBlockTypes,
    };
  }, [lookups?.shareholderBlockTypes]);

  return {
    blockTypes,
    getBlockType,
    blockTypeLookups,
  };
};
