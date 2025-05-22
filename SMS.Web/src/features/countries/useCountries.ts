import { useCallback, useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useCountries = () => {
  const { data } = useGetAllLookupsQuery();

  const { countryLookups, ethiopia, countries } = useMemo(() => {
    const countryLookups = (data?.countries || []).map<SelectOption>(
      ({ id, name }) => ({
        label: name || "",
        value: id,
      })
    );

    const ethiopia = data?.countries?.find((c) => c.code === "ETH");
    const countries = data?.countries || [];

    return { countryLookups, ethiopia, countries };
  }, [data]);

  const getCountryById = useCallback(
    (countryId?: number) =>
      (countryId && countries.find((c) => c.id === countryId)) || undefined,
    [countries]
  );

  return {
    countries,
    countryLookups,
    ethiopia,
    defaultCountryId: ethiopia?.id,
    getCountryById,
  };
};
