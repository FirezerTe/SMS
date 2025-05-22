import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useLazyPaidUpBalanceReportQuery } from "../../app/api";
import { DateRange } from "../../components/dateRange";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const PaidupBalanceReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [dateRange, setDateRange] = useState<{ to?: Date }>();
    const [getPaidupBalanceReport] = useLazyPaidUpBalanceReportQuery();

    useEffect(() => {
      onReportParamsValidation(!!dateRange?.to);
    }, [onReportParamsValidation, dateRange]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          if (dateRange?.to) {
            onDownloadStart();
            const { error } = await getPaidupBalanceReport({
              todate: dayjs(dateRange.to).format("YYYY-MM-DD"),
            });

            error ? onError(error) : onDownloadComplete();
          }
        },
      }),
      [
        dateRange,
        getPaidupBalanceReport,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return <DateRange onChange={setDateRange} />;
  }
);
