import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../app/api";
import { PaymentType } from "../../app/api/enums";
import { SelectOption } from "../../types";

export const usePaymentTypes = () => {
  const { data } = useGetAllLookupsQuery();

  const { paymentTypeLookups, paymentTypes } = useMemo(() => {
    const paymentTypeLookups = (data?.paymentTypes || []).map<SelectOption>(
      ({ value, displayName }) => ({
        label: displayName || "",
        value: value,
        isInactive: value === PaymentType.DividendCapitalize,
      })
    );
    return {
      paymentTypeLookups,
      paymentTypes: data?.paymentTypes || [],
    };
  }, [data]);

  const adjustmentPaymentTypes = useMemo(
    () =>
      paymentTypeLookups.filter(
        (s) =>
          s.value === PaymentType.Correction || s.value === PaymentType.Reversal
      ),
    [paymentTypeLookups]
  );

  const nonAdjustmentPaymentTypes = useMemo(
    () =>
      paymentTypeLookups.filter(
        (s) =>
          !adjustmentPaymentTypes.some((x) => x.value == s.value) &&
          s.value !== PaymentType.TransferPayment
      ),
    [adjustmentPaymentTypes, paymentTypeLookups]
  );

  return {
    paymentTypes,
    paymentTypeLookups: nonAdjustmentPaymentTypes,
    adjustmentPaymentTypeLookups: adjustmentPaymentTypes,
  };
};
