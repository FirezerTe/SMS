import { TextField } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useLazyTopShareholderByPaidUpReportQuery } from "../../app/api";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const TopshareholderByPaidupCapitalReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [count, setCount] = useState<number | null>(null);
    const [getTopShareholdersByPaidupReport] =
      useLazyTopShareholderByPaidUpReportQuery();

    useEffect(() => {
      onReportParamsValidation(!!count);
    }, [onReportParamsValidation, count]);

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCount(Number(event.target.value));
    };

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          if (count !== null) {
            // Check for null instead of falsy value
            onDownloadStart();
            const { error } = await getTopShareholdersByPaidupReport({
              count: count,
            });

            error ? onError(error) : onDownloadComplete();
          }
        },
      }),

      [
        count,
        getTopShareholdersByPaidupReport,
        setCount,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );

    return (
      <TextField
        type="number"
        name="count"
        value={count === null ? "" : count} // Render an empty string for null
        onChange={handleCountChange}
      />
    );
  }
);
