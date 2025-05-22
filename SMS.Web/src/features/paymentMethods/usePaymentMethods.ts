import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { SelectOption } from "../../types";

export const usePaymentMethods = () => {
  const { data } = useGetAllLookupsQuery();

  const { paymentMethodLookups, paymentMethods } = useMemo(() => {
    const paymentMethodLookups = (data?.paymentMethods || []).map<SelectOption>(
      ({ value, name }) => ({
        label: name || "",
        value: value,
      })
    );

    return {
      paymentMethodLookups,
      paymentMethods: data?.paymentMethods || [],
    };
  }, [data]);
  return {
    paymentMethods,
    paymentMethodLookups,
  };
};
