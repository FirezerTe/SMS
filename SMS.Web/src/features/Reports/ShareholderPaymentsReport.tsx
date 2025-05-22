import { Box } from "@mui/material";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  ShareholderBasicInfo,
  useLazyShareholderPaymentsReportQuery,
} from "../../app/api";
import { DateRange } from "../../components/dateRange";
import { ShareholderParamSelector } from "./ShareholderParamSelector";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const ShareholderPaymentsReport = forwardRef<
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

    const [getShareholderPayments] = useLazyShareholderPaymentsReportQuery();

    useEffect(() => {
      onReportParamsValidation(
        !!(
          dateRange?.to &&
          dateRange?.from &&
          dateRange.from <= dateRange.to &&
          selectedShareholder?.id
        )
      );
    }, [onReportParamsValidation, dateRange, selectedShareholder?.id]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          if (selectedShareholder?.id && dateRange?.from && dateRange?.to) {
            onDownloadStart();
            const { error } = await getShareholderPayments({
              fromDate: dayjs(dateRange.from).format("YYYY-MM-DD"),
              toDate: dayjs(dateRange.to).format("YYYY-MM-DD"),
              id: selectedShareholder.id,
            });

            error ? onError(error) : onDownloadComplete();
          }
        },
      }),
      [
        dateRange,
        getShareholderPayments,
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
