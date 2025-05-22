import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
    ShareholderTypeEnum, useCurrentUserInfoQuery,
    useGetUserDetailQuery, useLazyListofNewBranchPaymentsSummaryReportQuery
} from "../../app/api";
import { DateRange } from "../../components/dateRange";
import ShareholderTypeEnumComponent from "./ShareholderTypeEnumComponent";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const BranchSharePaymentsSummaryReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
    const [getAddtionalharePayments] =
      useLazyListofNewBranchPaymentsSummaryReportQuery();
    const [shareholderType, setShareholderType] =
      useState<ShareholderTypeEnum>();
    const {data}= useCurrentUserInfoQuery();
    console.log(data)
    const getUserBranchInfo=useGetUserDetailQuery(
          {
            id:data?.id as any
        } );

      

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
            const { error } = await getAddtionalharePayments({
              fromDate: dayjs(dateRange.from).format("YYYY-MM-DD"),
              toDate: dayjs(dateRange.to).format("YYYY-MM-DD"),
              shareholderStatusEnum: shareholderType,
              branchId: getUserBranchInfo.data?.branchId 
            });

            error ? onError(error) : onDownloadComplete();
          }
        },
      }),
      [
        dateRange,
        shareholderType,
        getAddtionalharePayments,
        onDownloadComplete,
        onDownloadStart,
        onError
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