import dayjs from "dayjs";
import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../app/api";

export const useCurrentDividendPeriod = () => {
  const { data } = useGetAllLookupsQuery();

  const periods = useMemo(
    () => ({
      currentDividendPeriod: data?.currentDividendPeriod,
      currentDividendPeriodStartDate: data?.currentDividendPeriod?.startDate,
      nextDividendPeriodStartDate:
        data?.currentDividendPeriod?.endDate &&
        dayjs(data.currentDividendPeriod.endDate)
          .add(1, "d")
          .format("YYYY-MM-DD"),
    }),
    [data]
  );

  return periods;
};
