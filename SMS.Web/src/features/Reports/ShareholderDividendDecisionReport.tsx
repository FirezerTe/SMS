import { Box } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  ShareholderBasicInfo,
  useLazyShareholderDividendDecisionReportQuery,
} from "../../app/api/SMSApi";
import { ShareholderParamSelector } from "./ShareholderParamSelector";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const ShareholderDividendDecisionReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [selectedShareholder, setSelectedShareholder] =
      useState<ShareholderBasicInfo>();

    const [getShareholderDividendDecision] =
      useLazyShareholderDividendDecisionReportQuery();

    useEffect(() => {
      onReportParamsValidation(!!true);
    }, [onReportParamsValidation]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          if (selectedShareholder?.id) {
            onDownloadStart();
            const { error } = await getShareholderDividendDecision({
              id: selectedShareholder.id,
            });

            error ? onError(error) : onDownloadComplete();
          }
        },
      }),
      [
        selectedShareholder,
        getShareholderDividendDecision,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return (
      <Box>
        <ShareholderParamSelector onChange={setSelectedShareholder} />
      </Box>
    );
  }
);
