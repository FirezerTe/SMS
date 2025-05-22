import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useDividendTerms = () => {
  const { data } = useGetAllLookupsQuery();

  const { dividendTermLookups, dividendTerms } = useMemo(() => {
    const dividendTermLookups = (
      data?.transferDividendTerms || []
    ).map<SelectOption>(({ value, displayName }) => ({
      label: displayName || "",
      value: value,
    }));
    return {
      dividendTermLookups,
      dividendTerms: data?.transferDividendTerms || [],
    };
  }, [data]);

  return {
    dividendTerms,
    dividendTermLookups,
  };
};
