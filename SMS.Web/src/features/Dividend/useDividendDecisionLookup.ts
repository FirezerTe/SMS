import { useCallback } from "react";
import { DividendDecisionType } from "../../app/api/enums";
import { SelectOption } from "../../types";

const dividendDecisionLookups: SelectOption[] = [
  {
    value: DividendDecisionType.FullyCapitalize,
    label: "Fully Capitalize",
  },
  {
    value: DividendDecisionType.FullyPay,
    label: "Fully Withdraw",
  },
  {
    value: DividendDecisionType.PartiallyCapitalize,
    label: "Partially Capitalize",
  },
];

export const useDividendDecisionLookup = () => {
  const getDividendDecisionTypeLabel = useCallback(
    (decision?: DividendDecisionType) =>
      [
        ...dividendDecisionLookups,
        {
          value: DividendDecisionType.Pending,
          label: "Pending",
        },
      ].find((x) => x.value === decision)?.label,
    []
  );

  return { dividendDecisionLookups, getDividendDecisionTypeLabel };
};
