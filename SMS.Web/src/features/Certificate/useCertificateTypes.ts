import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const useCertificateTypes = () => {
  const { data } = useGetAllLookupsQuery();

  const { certficateTypeLookups, certficateTypes } = useMemo(() => {
    const certficateTypeLookups = (
      data?.certficateTypes || []
    ).map<SelectOption>(({ value, name }) => ({
      label: name || "",
      value: value,
    }));

    return {
      certficateTypeLookups,
      certficateTypes: data?.certficateTypes || [],
    };
  }, [data]);
  return {
    certficateTypes,
    certficateTypeLookups,
  };
};
