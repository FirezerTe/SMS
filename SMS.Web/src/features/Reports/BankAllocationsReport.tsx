import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useLazyBankAllocationsReportQuery } from "../../app/api";
import { DateRange } from "../../components/dateRange";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const BankAllocationsReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
    const [getBankAllocationsReport] = useLazyBankAllocationsReportQuery();

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
            const { error } = await getBankAllocationsReport({
              fromDate: dayjs(dateRange.from).format("YYYY-MM-DD"),
              toDate: dayjs(dateRange.to).format("YYYY-MM-DD"),
            });

            error ? onError(error) : onDownloadComplete();
          }
        },
      }),
      [
        dateRange,
        getBankAllocationsReport,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return <DateRange onChange={setDateRange} />;
  }
);
