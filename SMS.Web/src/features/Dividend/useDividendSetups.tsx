import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useGetSetupsQuery } from "../../app/api";
import {
  DividendDistributionStatus,
  DividendRateComputationStatus,
} from "../../app/api/enums";
import { useDividendPeriods } from "./useDividendPeriods";

export const useDividendSetups = () => {
  const [pollingInterval, setPollingInterval] = useState<number>();
  const { data, isSuccess } = useGetSetupsQuery(undefined, {
    pollingInterval,
  });
  const { dividendPeriods } = useDividendPeriods();

  useEffect(() => {
    const shouldPoll = (data || []).some(
      (x) =>
        x.dividendRateComputationStatus ===
          DividendRateComputationStatus.Computing ||
        x.distributionStatus === DividendDistributionStatus.Started
    );

    if (shouldPoll && !pollingInterval) {
      setPollingInterval(10000);
    }
    if (!shouldPoll && pollingInterval) {
      setPollingInterval(undefined);
    }
  }, [data, pollingInterval]);

  const { dividendSetups } = useMemo(() => {
    const dividendSetups = (data || [])
      .map((s) => {
        const dividendPeriod = dividendPeriods.find(
          (d) => d.id === s.dividendPeriodId
        );

        return {
          ...s,
          dividendPeriodStartDate: dayjs(dividendPeriod?.startDate),
          dividendPeriodEndDate: dayjs(dividendPeriod?.endDate),
        };
      })
      .sort((a, b) => {
        const isAfter = a.dividendPeriodEndDate.isAfter(
          b.dividendPeriodEndDate
        );

        return isAfter ? -1 : 1;
      });

    return {
      dividendSetups,
    };
  }, [data, dividendPeriods]);

  return {
    dividendSetups,
    fetched: isSuccess,
  };
};
