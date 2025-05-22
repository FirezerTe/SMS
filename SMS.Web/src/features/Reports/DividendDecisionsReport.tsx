import { Box } from "@mui/material";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useLazyDividendDecisionsReportQuery } from "../../app/api/SMSApi";
import { DateRange } from "../../components/dateRange";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const DividendDecisionsReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();

    const [getNewShareholders] = useLazyDividendDecisionsReportQuery();

    useEffect(() => {
      onReportParamsValidation(!!true);
    }, [onReportParamsValidation]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          onDownloadStart();
          const { error } = await getNewShareholders({
            fromDate: dayjs(dateRange?.from).format("YYYY-MM-DD"),
            toDate: dayjs(dateRange?.to).format("YYYY-MM-DD"),
          });

          error ? onError(error) : onDownloadComplete();
        },
      }),
      [
        dateRange,
        getNewShareholders,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return (
      <Box>
        <DateRange onChange={setDateRange} />
      </Box>
    );
  }
);
