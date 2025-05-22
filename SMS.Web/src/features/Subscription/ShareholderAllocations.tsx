import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useShareholderAllocations } from "../Allocation";
import { formatNumber } from "../common";

export const ShareholderAllocations = () => {
  const { activeShareholderAllocations } = useShareholderAllocations();

  return (
    !!activeShareholderAllocations?.length && (
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ lineHeight: 2, flex: 1, py: 1 }}
          color="textSecondary"
        >
          Shareholder Allocations
        </Typography>
        <Box sx={{ px: 4 }}>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Allocation</TableCell>
                  <TableCell>Subscription Group</TableCell>
                  <TableCell align="right">
                    Subscriptions (ETB)
                    <Box>
                      <Typography
                        component={"span"}
                        variant="subtitle2"
                        color="success.main"
                      >
                        Approved
                      </Typography>
                      /
                      <Typography
                        component={"span"}
                        variant="subtitle2"
                        color="warning.main"
                      >
                        Pending
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    Payments (ETB)
                    <Box>
                      <Typography
                        component={"span"}
                        variant="subtitle2"
                        color="success.main"
                      >
                        Approved
                      </Typography>
                      /
                      <Typography
                        component={"span"}
                        variant="subtitle2"
                        color="warning.main"
                      >
                        Pending
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    Total Allocated Amount (ETB)
                  </TableCell>
                  <TableCell align="right">
                    Available for Purchase (ETB)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeShareholderAllocations.map((item, index) => (
                  <TableRow
                    key={`${item.allocationId}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell>{item.subscriptionGroups}</TableCell>
                    <TableCell align="right">
                      {
                        <>
                          <Typography
                            component={"span"}
                            variant="subtitle2"
                            color="success.main"
                          >
                            {formatNumber(item.approvedSubscriptionsTotal)}
                          </Typography>
                          /
                          <Typography
                            component={"span"}
                            variant="subtitle2"
                            color="warning.main"
                          >
                            {formatNumber(item.submittedSubscriptionsTotal)}
                          </Typography>
                        </>
                      }
                    </TableCell>
                    <TableCell align="right">
                      {
                        <>
                          <Typography
                            component={"span"}
                            variant="subtitle2"
                            color="success.main"
                          >
                            {formatNumber(item.approvedPaymentsTotal)}
                          </Typography>
                          /
                          <Typography
                            component={"span"}
                            variant="subtitle2"
                            color="warning.main"
                          >
                            {formatNumber(item.submittedPaymentsTotal)}
                          </Typography>
                        </>
                      }
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(item.maxPurchaseLimit, 0)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        component={"span"}
                        // variant="subtitle2"
                        fontWeight={"bold"}
                        color="success.main"
                      >
                        {formatNumber(
                          (item.maxPurchaseLimit || 0) -
                            ((item.approvedSubscriptionsTotal || 0) +
                              (item.submittedSubscriptionsTotal || 0)),
                          0
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    )
  );
};
