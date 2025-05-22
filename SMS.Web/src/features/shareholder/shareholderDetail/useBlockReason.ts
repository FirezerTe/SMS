import { useCallback, useMemo } from "react";
import { useGetAllLookupsQuery } from "../../../app/api";
import { SelectOption } from "../../../types";

export const useBlockReasons = () => {
  const { data: lookups } = useGetAllLookupsQuery();

  const getBlockReason = useCallback(
    (id?: number | null) =>
      lookups?.shareholderBlockReasons?.find((r) => r.id == id) || undefined,
    [lookups?.shareholderBlockReasons]
  );

  const { blockReasonLookups, blockReasons } = useMemo(() => {
    const blockReasonLookups = (
      lookups?.shareholderBlockReasons || []
    ).map<SelectOption>(({ id, name }) => ({
      label: name || "",
      value: id,
    }));
    return {
      blockReasonLookups,
      blockReasons: lookups?.shareholderBlockReasons,
    };
  }, [lookups?.shareholderBlockReasons]);

  return {
    blockReasons,
    getBlockReason,
    blockReasonLookups,
  };
};
