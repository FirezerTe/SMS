import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  ShareholderBasicInfo,
  useLazyExpiredSubscriptionsReportQuery,
} from "../../app/api";
import { DateRange } from "../../components/dateRange";
import { ReportComponentProps, ReportComponentRef } from "./utils";
import { ShareholderParamSelector } from "./ShareholderParamSelector";
import { Box } from "@mui/material";
import { number } from "yup";

export const ExpiredSubscriptionsReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();

    const [selectedShareholder, setSelectedShareholder] =
      useState<ShareholderBasicInfo>();

    const [getExpiredSubscriptionsReport] =
      useLazyExpiredSubscriptionsReportQuery();

    useEffect(() => {
      onReportParamsValidation(
        !!(dateRange?.to &&
          dateRange?.from &&
          dateRange.from <= dateRange.to &&
          selectedShareholder?.id,
        number)
      );
    }, [onReportParamsValidation, dateRange, selectedShareholder?.id]);

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
          const id = selectedShareholder?.id || 0;

          const { error } = await getExpiredSubscriptionsReport({
            fromDate,
            toDate,
            id,
          });

          error ? onError(error) : onDownloadComplete();
        },
      }),
      [
        dateRange,
        getExpiredSubscriptionsReport,
        onDownloadComplete,
        onDownloadStart,
        onError,
        selectedShareholder?.id,
      ]
    );
    return (
      <Box>
        <ShareholderParamSelector onChange={setSelectedShareholder} />
        <DateRange onChange={setDateRange} />
      </Box>
    );
  }
);
