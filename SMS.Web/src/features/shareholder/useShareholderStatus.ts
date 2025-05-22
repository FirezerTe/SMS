import { useCallback } from "react";
import { ShareholderStatusEnum, useGetAllLookupsQuery } from "../../app/api";

export const useShareholderStatus = () => {
  const { data: lookups } = useGetAllLookupsQuery();

  const getStatus = useCallback(
    (status?: ShareholderStatusEnum) => {
      return (
        (status &&
          (lookups?.shareholderStatuses || []).find(
            (s) => s.value === status
          )) ||
        undefined
      );
    },
    [lookups]
  );

  return {
    statuses: lookups?.shareholderStatuses,
    getStatus,
  };
};
