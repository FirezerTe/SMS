import { useMemo } from "react";
import { useGetAllBankAllocationsQuery } from "../../app/api";

export const useBankAllocation = () => {
  const { data } = useGetAllBankAllocationsQuery();

  const bankAllocations = useMemo(() => {
    const { approved, draft, rejected, submitted } = data || {};

    const hasBankAllocation = !!(
      approved?.length ||
      rejected?.length ||
      rejected?.length ||
      submitted?.length ||
      draft?.length
    );
    const currentBankAllocation =
      (approved?.length && approved[0]) || undefined;
    const bankAllocationHistory = (approved?.length && approved.slice(1)) || [];

    return {
      draft: draft || [],
      rejected: rejected || [],
      submitted: submitted || [],
      currentBankAllocation,
      bankAllocationHistory,
      hasBankAllocation,
    };
  }, [data]);

  return bankAllocations;
};
