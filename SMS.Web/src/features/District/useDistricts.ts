import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useDistricts = () => {
  const { data } = useGetAllLookupsQuery();

  const { districtLookups, districts } = useMemo(() => {
    const districtLookups = (data?.district || []).map<SelectOption>((d) => ({
      label: d.districtName || d.districtCode || "",
      value: d.id,
    }));
    return { districtLookups, districts: data?.district || [] };
  }, [data]);
  return {
    districts,
    districtLookups,
  };
};
