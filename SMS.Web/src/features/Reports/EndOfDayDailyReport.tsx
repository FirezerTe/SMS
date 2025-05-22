import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { DateRange } from "../../components/dateRange";
import { ReportComponentProps, ReportComponentRef } from "./utils";
import { useLazyEndOfDayDailyReportQuery } from "../../app/api";

export const EndOfDayDailyReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
    const [getEndOfDayDailyReport] = useLazyEndOfDayDailyReportQuery();

    useEffect(() => {
      onReportParamsValidation(
        !!(dateRange?.to && dateRange?.from && dateRange.from <= dateRange.to)
      );
    }, [onReportParamsValidation, dateRange]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          if (dateRange?.from && dateRange?.to) {
            onDownloadStart();
            const { error } = await getEndOfDayDailyReport({
              fromDate: dayjs(dateRange.from).format("YYYY-MM-DD"),
              toDate: dayjs(dateRange.to).format("YYYY-MM-DD"),
            });

            error ? onError(error) : onDownloadComplete();
          }
        },
      }),
      [
        dateRange,
        getEndOfDayDailyReport,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return <DateRange onChange={setDateRange} />;
  }
);
