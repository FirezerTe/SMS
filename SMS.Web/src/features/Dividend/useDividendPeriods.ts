import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { useGetDividendPeriodsQuery, useGetSetupsQuery } from "../../app/api";
import { DividendDistributionStatus } from "../../app/api/enums";
import { SelectOption } from "../../types";

export const useDividendPeriods = () => {
  const { data: setups } = useGetSetupsQuery();

  const { data: periods } = useGetDividendPeriodsQuery();

  const { dividendPeriodLookups, dividendPeriods } = useMemo(() => {
    const sortedDividendPeriods = (periods || [])
      .map((d) => ({
        ...d,
        startDate: dayjs(d.startDate),
        endDate: dayjs(d.endDate),
      }))
      .sort((a, b) => (a.endDate.isAfter(b.endDate) ? 1 : -1));

    const dividendPeriodLookups = sortedDividendPeriods.map<SelectOption>(
      ({ id, year, startDate, endDate }) => ({
        label: `${year || ""} (${startDate.format(
          "MMMM DD, YYYY"
        )} - ${endDate.format("MMMM DD, YYYY")})`,
        value: id,
        isInactive: (setups || []).some(
          (s) =>
            s.dividendPeriodId === id &&
            s.distributionStatus === DividendDistributionStatus.Completed
        ),
      })
    );

    return { dividendPeriodLookups, dividendPeriods: sortedDividendPeriods };
  }, [periods, setups]);

  const getDividendPeriodLookup = useCallback(
    (id?: number) => dividendPeriodLookups.find((x) => x.value === id),
    [dividendPeriodLookups]
  );

  const getDividendPeriod = useCallback(
    (id?: number) => dividendPeriods.find((x) => x.id === id),
    [dividendPeriods]
  );

  return {
    dividendPeriods,
    dividendPeriodLookups,
    getDividendPeriodLookup,
    getDividendPeriod,
  };
};
