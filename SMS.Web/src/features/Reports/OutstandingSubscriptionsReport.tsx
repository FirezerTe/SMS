import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { DateRange } from "../../components/dateRange";
import { ReportComponentProps, ReportComponentRef } from "./utils";
import { useLazyOutstandingSubscriptionsReportQuery } from "../../app/api";
import { string } from "yup";

export const OutstandingSubscriptionsReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
    const [getOutstandingSubscriptionsReport] =
      useLazyOutstandingSubscriptionsReportQuery();

    useEffect(() => {
      onReportParamsValidation(
        !!(dateRange?.to && dateRange?.from && dateRange.from <= dateRange.to,
        string)
      );
    }, [onReportParamsValidation, dateRange]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          onDownloadStart();
          const fromDate = dateRange?.from
            ? dayjs(dateRange.from).format("YYYY-MM-DD")
            : undefined;
          const toDate = dateRange?.to
            ? dayjs(dateRange.to).format("YYYY-MM-DD")
            : undefined;

          const { error } = await getOutstandingSubscriptionsReport({
            fromDate,
            toDate,
          });

          error ? onError(error) : onDownloadComplete();
        },
      }),
      [
        dateRange,
        getOutstandingSubscriptionsReport,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return <DateRange onChange={setDateRange} />;
  }
);
