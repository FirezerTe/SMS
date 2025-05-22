import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useLazyListofFractionalPaidUpAmountsReportQuery } from "../../app/api";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const FractionalPaidupReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [getFractionalPaidUpAmountsReport] =
      useLazyListofFractionalPaidUpAmountsReportQuery();
    useEffect(() => {
      onReportParamsValidation(true);
    }, [onReportParamsValidation]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          onDownloadStart();
          const { error } = await getFractionalPaidUpAmountsReport();

          error ? onError(error) : onDownloadComplete();
        },
      }),
      [
        getFractionalPaidUpAmountsReport,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return <></>;
  }
);
