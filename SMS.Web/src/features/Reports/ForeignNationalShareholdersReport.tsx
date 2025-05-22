import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useLazyListOfForeignNationalShareholdersReportQuery } from "../../app/api";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const ForeignNationalShareholdersListReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [getForeignNationalShareholdersReport] =
      useLazyListOfForeignNationalShareholdersReportQuery();
    useEffect(() => {
      onReportParamsValidation(true);
    }, [onReportParamsValidation]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          onDownloadStart();
          const { error } = await getForeignNationalShareholdersReport();

          error ? onError(error) : onDownloadComplete();
        },
      }),
      [
        getForeignNationalShareholdersReport,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return <></>;
  }
);
