import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useForeignCurrencies = () => {
  const { data } = useGetAllLookupsQuery();

  const { foreignCurrencyLookups, foreignCurrencies } = useMemo(() => {
    const foreignCurrencyLookups = (
      data?.foreignCurrencyTypes || []
    ).map<SelectOption>(({ id, name, description }) => ({
      label: `${description || ""} (${name || ""})`,
      value: id,
    }));

    return {
      foreignCurrencyLookups,
      foreignCurrencies: data?.foreignCurrencyTypes || [],
    };
  }, [data]);

  return {
    foreignCurrencies,
    foreignCurrencyLookups,
  };
};
