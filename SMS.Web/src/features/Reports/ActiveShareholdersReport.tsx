import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  ShareholderTypeEnum,
  useLazyListOfActiveShareholdersReportQuery,
} from "../../app/api";
import { DateRange } from "../../components/dateRange";
import ShareholderTypeEnumComponent from "./ShareholderTypeEnumComponent";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const ActiveShareholdersListReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
    const [shareholderType, setShareholderType] =
      useState<ShareholderTypeEnum>();

    const [getActiveShareholders] =
      useLazyListOfActiveShareholdersReportQuery();

    useEffect(() => {
      onReportParamsValidation(!!true);
    }, [onReportParamsValidation]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          onDownloadStart();
          const { error } = await getActiveShareholders({
            fromDate: dayjs(dateRange?.from).format("YYYY-MM-DD"),
            toDate: dayjs(dateRange?.to).format("YYYY-MM-DD"),
            shareholderStatusEnum: shareholderType,
          });

          error ? onError(error) : onDownloadComplete();
        },
      }),
      [
        dateRange,
        getActiveShareholders,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );

    return (
      <Box>
        <Grid item xs={4}>
          <ShareholderTypeEnumComponent onChange={setShareholderType} />{" "}
        </Grid>
        <DateRange onChange={setDateRange} />
      </Box>
    );
  }
);
