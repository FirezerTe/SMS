import { Box, Divider, Typography } from "@mui/material";
import { ShareholderSubscriptionsSummary } from "../../../../app/api";
import { ContentCard } from "../../../../components";
import { formatNumber } from "../../../common";

export const SubscriptionsKpi = ({
  summary,
}: {
  summary?: ShareholderSubscriptionsSummary;
}) => {
  return (
    <ContentCard contentStyle={{ p: 2 }} border={true} sx={{ height: "100%" }}>
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{ textAlign: "center" }}
      >
        Subscriptions
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
        <Typography variant="h5" color="inherit">
          {formatNumber(summary?.totalSubscriptions)} ETB
        </Typography>
      </Box>

      <Box sx={{ pt: 1, display: "flex", justifyContent: "center" }}>
        <Typography
          variant="subtitle2"
          color="success.main"
          sx={{ flex: 1, textAlign: "center" }}
        >
          Approved:{" "}
          <Typography component="span" variant="h6">
            {formatNumber(summary?.totalApprovedSubscriptions)} ETB
          </Typography>
        </Typography>
        <Box>
          <Divider orientation="vertical" />
        </Box>
        <Typography
          variant="subtitle2"
          color="warning.main"
          sx={{ flex: 1, textAlign: "center" }}
        >
          Pending:{" "}
          <Typography component="span" variant="h6">
            {formatNumber(summary?.totalPendingApprovalSubscriptions)} ETB
          </Typography>
        </Typography>
      </Box>
    </ContentCard>
  );
};
