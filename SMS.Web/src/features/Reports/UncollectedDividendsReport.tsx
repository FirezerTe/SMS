import { Box } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  ShareholderBasicInfo,
  useLazyUncollectedDividendReportQuery,
} from "../../app/api/SMSApi";

import { ShareholderParamSelector } from "./ShareholderParamSelector";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const UncollectedDividends = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [selectedShareholder, setSelectedShareholder] =
      useState<ShareholderBasicInfo>();

    const [getUncollectedDividends] = useLazyUncollectedDividendReportQuery();

    useEffect(() => {
      onReportParamsValidation(!!true);
    }, [onReportParamsValidation]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          if (selectedShareholder?.id) {
            onDownloadStart();
            const { error } = await getUncollectedDividends({
              id: selectedShareholder.id,
            });

            error ? onError(error) : onDownloadComplete();
          }
        },
      }),
      [
        selectedShareholder,
        getUncollectedDividends,
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
