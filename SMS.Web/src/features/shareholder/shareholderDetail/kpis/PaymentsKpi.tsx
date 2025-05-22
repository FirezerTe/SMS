import { Box, Divider, Typography } from "@mui/material";
import { ShareholderSubscriptionsSummary } from "../../../../app/api";
import { ContentCard } from "../../../../components";
import { formatNumber } from "../../../common";

export const PaymentsKpi = ({
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
        Payments
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
        <Typography variant="h5" color="inherit">
          {formatNumber(summary?.totalPayments)} ETB
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
            {formatNumber(summary?.totalApprovedPayments)} ETB
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
            {formatNumber(summary?.totalPendingApprovalPayments)} ETB
          </Typography>
        </Typography>
        <Box>
          <Divider orientation="vertical" />
        </Box>
        <Typography
          variant="subtitle2"
          component="div"
          color="info.main"
          sx={{ flex: 1, textAlign: "center" }}
        >
          Outstanding:{" "}
          <Typography component="span" variant="h6">
            {formatNumber(
              (summary?.totalSubscriptions || 0) - (summary?.totalPayments || 0)
            )}{" "}
            ETB
          </Typography>
        </Typography>
      </Box>
    </ContentCard>
  );
};
