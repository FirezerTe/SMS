import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useLazyActiveShareholderListForGaQuery } from "../../app/api";
import { ReportComponentProps, ReportComponentRef } from "./utils";
import { number } from "yup";

export const ActiveShareholderListForGAReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [getActiveShareholderListForGAs] =
      useLazyActiveShareholderListForGaQuery();

    useEffect(() => {
      onReportParamsValidation(number as any);
    }, [onReportParamsValidation]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          onDownloadStart();
          const { error } = await getActiveShareholderListForGAs();

          error ? onError(error) : onDownloadComplete();
        },
      }),
      [
        getActiveShareholderListForGAs,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return null;
  }
);
