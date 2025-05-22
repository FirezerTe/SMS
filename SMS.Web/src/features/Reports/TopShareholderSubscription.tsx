import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ReportComponentProps, ReportComponentRef } from "./utils";
import { useLazyTopSubscriptionsReportQuery } from "../../app/api";
import { Grid, TextField } from "@mui/material";

export const TopSubscriptionsReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [topSubscriptionAmount, setTopSubscriptionAmount] =
      useState<number>();
    const [getTopSubscriptionsReport] = useLazyTopSubscriptionsReportQuery();

    useEffect(() => {
      onReportParamsValidation(!!topSubscriptionAmount);
    }, [onReportParamsValidation, topSubscriptionAmount]);
    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTopSubscriptionAmount(Number(event.target.value));
    };

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          if (topSubscriptionAmount) {
            onDownloadStart();
            const { error } = await getTopSubscriptionsReport({
              subscriptionAmount: topSubscriptionAmount as any,
            });

            error ? onError(error) : onDownloadComplete();
          }
        },
      }),
      [
        topSubscriptionAmount,
        getTopSubscriptionsReport,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );
    return (
      <Grid item xs={12}>
        <TextField
          style={{ width: "400px", height: "40px" }}
          placeholder="# Top Shareholder"
          type="number"
          name="topSubscriptionAmount"
          value={topSubscriptionAmount === null ? "" : topSubscriptionAmount} // Render an empty string for null
          onChange={handleCountChange}
        />
      </Grid>
    );
  }
);
