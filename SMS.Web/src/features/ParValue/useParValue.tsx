import { useMemo } from "react";
import { useGetAllParValuesQuery } from "../../app/api";

export const useParValue = () => {
  const { data } = useGetAllParValuesQuery();

  const parValue = useMemo(() => {
    const { approved, draft, rejected, submitted } = data || {};

    const hasParValue = !!(
      approved?.length ||
      rejected?.length ||
      rejected?.length ||
      submitted?.length ||
      draft?.length
    );
    const currentParValue = (approved?.length && approved[0]) || undefined;
    const parValueHistory = (approved?.length && approved.slice(1)) || [];

    return {
      draft: draft || [],
      rejected: rejected || [],
      submitted: submitted || [],
      currentParValue,
      parValueHistory,
      hasParValue,
    };
  }, [data]);

  return parValue;
};
