import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  ShareholderBasicInfo,
  useLazySubscriptionsReportQuery,
} from "../../app/api";
import { DateRange } from "../../components/dateRange";
import { ReportComponentProps, ReportComponentRef } from "./utils";
import { ShareholderParamSelector } from "./ShareholderParamSelector";
import { Box } from "@mui/material";
import { number } from "yup";

export const SubscriptionsReport = forwardRef<
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

    const [getSubscriptionsReport] = useLazySubscriptionsReportQuery();

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

          const { error } = await getSubscriptionsReport({
            fromDate,
            toDate,
            id,
          });

          error ? onError(error) : onDownloadComplete();
        },
      }),
      [
        dateRange,
        getSubscriptionsReport,
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
