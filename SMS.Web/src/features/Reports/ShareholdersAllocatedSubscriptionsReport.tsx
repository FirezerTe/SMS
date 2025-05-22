import { Box } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  ShareholderBasicInfo,
  useLazyShareholderAllocationsReportQuery,
} from "../../app/api";
import { ShareholderParamSelector } from "./ShareholderParamSelector";
import { ReportComponentProps, ReportComponentRef } from "./utils";
import { number } from "yup";

export const ShareholderAllocatedSubscriptionsReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [selectedShareholder, setSelectedShareholder] =
      useState<ShareholderBasicInfo>();

    const [getShareholdersAllocatedSubscriptions] =
      useLazyShareholderAllocationsReportQuery();

    useEffect(() => {
      onReportParamsValidation(!!(selectedShareholder?.id, number));
    }, [onReportParamsValidation, selectedShareholder?.id]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          onDownloadStart();
          const { error } = await getShareholdersAllocatedSubscriptions({
            id: selectedShareholder?.id || 0,
          });

          error ? onError(error) : onDownloadComplete();
        },
      }),
      [
        getShareholdersAllocatedSubscriptions,
        onDownloadComplete,
        onDownloadStart,
        onError,
        selectedShareholder?.id,
      ]
    );

    return (
      <Box>
        <ShareholderParamSelector onChange={setSelectedShareholder} />
      </Box>
    );
  }
);
