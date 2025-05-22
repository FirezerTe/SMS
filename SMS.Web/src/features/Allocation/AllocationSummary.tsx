import { Box, CardContent, Paper, Typography } from "@mui/material";
import { Fragment } from "react";
import { useGetAllocationSummariesQuery } from "../../app/api";
import { formatNumber } from "../common";

export const AllocationSummary = () => {
  const { data: allocationSummaries } = useGetAllocationSummariesQuery();

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {(allocationSummaries || []).map((summary) => (
        <Fragment key={summary.id}>
          <Paper
            sx={{
              minWidth: 300,
              p: 2,
              backgroundColor: summary.isDividendAllocation
                ? "#F3ECE6"
                : undefined,
            }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Allocation
              </Typography>
              <Typography variant="h6">{summary.allocationName}</Typography>
              {!!summary.isOnlyForExistingShareholders && (
                <Typography color="info.main" variant="subtitle1">
                  Only for Existing Shareholders
                </Typography>
              )}
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Allocated
                </Typography>
                <Typography variant="h5">
                  {formatNumber(summary.totalAllocation)}
                </Typography>
                <Typography variant="caption">
                  (
                  {formatNumber(
                    (summary.totalAllocation || 0) -
                      ((summary.totalApprovedSubscriptions || 0) +
                        (summary.totalPendingApprovalSubscriptions || 0))
                  )}{" "}
                  available for sale)
                </Typography>
              </Box>
              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Subscriptions
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1">
                      Total:{" "}
                      {formatNumber(
                        (summary.totalApprovedSubscriptions || 0) +
                          (summary.totalPendingApprovalSubscriptions || 0)
                      )}
                      <Typography
                        component="span"
                        color="text.primary"
                        variant="caption"
                        sx={{ pl: 1 }}
                      >
                        (
                        <strong>
                          {formatNumber(
                            (((summary.totalApprovedSubscriptions || 0) +
                              (summary.totalPendingApprovalSubscriptions ||
                                0)) /
                              (summary.totalAllocation || 1)) *
                              100,
                            2
                          )}
                          %
                        </strong>
                        {" of allocated"})
                      </Typography>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="success.main">
                        Approved:{" "}
                        {formatNumber(summary.totalApprovedSubscriptions)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="warning.main">
                        Pending:{" "}
                        {formatNumber(
                          summary.totalPendingApprovalSubscriptions
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Payments
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1">
                      Total:{" "}
                      {formatNumber(
                        (summary.totalApprovedPayments || 0) +
                          (summary.totalPendingApprovalPayments || 0)
                      )}
                      <Typography
                        component="span"
                        color="text.primary"
                        variant="caption"
                        sx={{ ml: 1 }}
                      >
                        <strong>
                          (
                          {formatNumber(
                            (((summary.totalApprovedPayments || 0) +
                              (summary.totalPendingApprovalPayments || 0)) /
                              ((summary.totalApprovedSubscriptions || 0) +
                                (summary.totalPendingApprovalSubscriptions ||
                                  0) || 1)) *
                              100,
                            2
                          )}
                          %
                        </strong>
                        {" of subscribed"})
                      </Typography>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="success.main">
                        Approved:{" "}
                        {formatNumber(summary.totalApprovedPayments || 0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="warning.main">
                        Pending:{" "}
                        {formatNumber(
                          summary.totalPendingApprovalPayments || 0
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </Fragment>
      ))}
    </Box>
  );
};
