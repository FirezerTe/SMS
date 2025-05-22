import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import {
  useGetShareholderInfoQuery,
  useGetShareholderSubscriptionSummaryQuery,
  useGetTransfersByShareholderIdQuery,
} from "../../../app/api";
import { ApprovalStatus } from "../../../app/api/enums";
import { TransferSummary } from "../../Transfer";
import { CommentHistory } from "../CommentHistory";
import { ShareholderBlockDetail } from "./block/ShareholderBlockDetail";
import { PaymentsKpi, SubscriptionsKpi } from "./kpis";
import { useShareholderChangeLogs } from "./shareholderChangeLog";
import { ShareholderChangeLog } from "./shareholderChangeLog/ShareholderChangeLog";
import { ShareholderDetailHeader } from "./ShareholderDetailHeader";
import { ShareholderDetailTabs } from "./ShareholderDetailTabs";
import { useShareholderIdAndVersion } from "./useShareholderIdAndVersion";

export const ShareholderDetail = () => {
  const { id: shareholderId, version } = useShareholderIdAndVersion();
  const skipFetching = { skip: !shareholderId };
  const { data: subscriptionSummary } =
    useGetShareholderSubscriptionSummaryQuery(
      {
        id: shareholderId,
      },
      skipFetching
    );

  const { data: shareholderInfo } = useGetShareholderInfoQuery(
    {
      id: shareholderId,
      version,
    },
    skipFetching
  );
  const { data: transfers } = useGetTransfersByShareholderIdQuery(
    {
      shareholderId,
    },
    skipFetching
  );

  const { changeLabels } = useShareholderChangeLogs();

  const unApprovedTransfers = useMemo(
    () =>
      (transfers || []).filter(
        (t) => t.approvalStatus != ApprovalStatus.Approved
      ),
    [transfers]
  );

  if (!shareholderInfo) {
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flex: 1 }}>
        <Grid container rowSpacing={4.5}>
          <Grid item xs={12} sx={{ mb: -4 }}>
            <ShareholderDetailHeader />
          </Grid>
          {!!changeLabels?.length && (
            <Grid item xs={12}>
              <ShareholderChangeLog changeLabels={changeLabels} />
            </Grid>
          )}
          {!!shareholderInfo.isBlocked && (
            <Grid item xs={12}>
              <ShareholderBlockDetail />
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container rowSpacing={2} columnSpacing={2.75}>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                alignSelf="stretch"
                sx={{ minWidth: "500px" }}
              >
                <SubscriptionsKpi summary={subscriptionSummary} />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                alignSelf="stretch"
                sx={{ minWidth: "640px" }}
              >
                <PaymentsKpi summary={subscriptionSummary} />
              </Grid>
            </Grid>
          </Grid>
          {shareholderInfo &&
            shareholderInfo.approvalStatus !== ApprovalStatus.Approved &&
            !!unApprovedTransfers?.length && (
              <>
                <Grid item xs={12} sx={{ mt: 1, mb: -2 }}>
                  <Typography variant="h6">Active Transfers</Typography>
                </Grid>

                {unApprovedTransfers.map((t) => (
                  <Grid key={t.id} item xs={12}>
                    <TransferSummary transfer={t} />{" "}
                  </Grid>
                ))}
              </>
            )}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Paper sx={{ p: 2, flex: 1 }}>
              <ShareholderDetailTabs />
              <Divider />
              <Box
                sx={{
                  backgroundColor: "#fafafb",
                  padding: 1,
                  paddingBottom: 2,
                }}
              >
                <Outlet />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{ lineHeight: 2, flex: 1, pt: 3 }}
              color="textSecondary"
            >
              Notes & Comments
            </Typography>

            {!!shareholderInfo.id && (
              <CommentHistory
                comments={shareholderInfo.comments}
                shareholderId={shareholderInfo.id}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: { sm: "none", md: "block", lg: "none" } }}
          />
        </Grid>
        <Grid item xs={12}></Grid>
      </Box>
    </Box>
  );
};
