import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import { DividendDecisionSummaryDto } from "../../../app/api";
import { formatNumber } from "../../common";
import { useDividendDecisionLookup } from "../useDividendDecisionLookup";
import { DividendPeriodTooltip } from "./DividendPeriodTooltip";

export const ShareholderDividendList = ({
  dividends,
}: {
  dividends: DividendDecisionSummaryDto;
}) => {
  const { getDividendDecisionTypeLabel } = useDividendDecisionLookup();

  if (!dividends?.decisions?.length) return null;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell width={150}>Dividend Period</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">
                  Subscription Payments (ETB)
                </Typography>
                <Typography variant="subtitle2">
                  (Total / Weighted Average)
                </Typography>
              </TableCell>
              <TableCell align="left">Action</TableCell>
              <TableCell align="right">Dividend Payment (ETB)</TableCell>
              <TableCell align="right">Capitalized Amount (ETB)</TableCell>
              <TableCell align="right">Fulfillment Amount (ETB)</TableCell>
              <TableCell align="right">Withdrawn Amount (ETB)</TableCell>
              <TableCell align="right">Tax (ETB)</TableCell>
              <TableCell align="right">Net Pay (ETB)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...(dividends?.decisions || [])].map((decision) => (
              <Fragment key={decision.id}>
                <TableRow>
                  <TableCell width={150}>
                    <DividendPeriodTooltip decision={decision} />
                  </TableCell>

                  <TableCell align="right">
                    {`${formatNumber(
                      decision.dividend?.totalPaidAmount,
                      4
                    )} / ${formatNumber(
                      decision.dividend?.totalPaidWeightedAverage,
                      4
                    )}`}
                  </TableCell>
                  {/* <TableCell align="right" >
                    {formatNumber(d.dividend?.totalPaidWeightedAverage, 3)}
                  </TableCell> */}
                  <TableCell align="left">
                    <Typography
                      variant="subtitle2"
                      component="span"
                      color="info.main"
                    >
                      {getDividendDecisionTypeLabel(decision.decision)}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="subtitle2">
                      {formatNumber(decision.dividend?.dividendAmount, 3)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(decision.capitalizedAmount, 3)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(decision.fulfillmentPayment, 3) || 0}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(decision.withdrawnAmount, 3) || 0}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(decision.tax, 3)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(decision.netPay, 3)}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
            <TableRow
              key="TOTAL"
              sx={{
                " > *": { borderBottom: "0 !important" },
              }}
            >
              <TableCell align="right" colSpan={3}></TableCell>
              <TableCell align="right" sx={{ py: 3 }}>
                <Typography variant="subtitle1" fontWeight={"bold"}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ flex: 1 }}></Box>
                    TOTAL
                    <Box sx={{ width: 50 }}></Box>
                    {formatNumber(dividends.totalDividendPayment, 3)}
                  </Box>
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight={"bold"}>
                  {formatNumber(dividends.totalCapitalizedAmount, 3)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight={"bold"}>
                  {formatNumber(dividends.totalFulfillmentAmount, 3)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight={"bold"}>
                  {formatNumber(dividends.totalWithdrawnAmount, 3)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight={"bold"}>
                  {formatNumber(dividends.totalTaxPaid, 3)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight={"bold"}>
                  {formatNumber(dividends.totalNetPay, 3)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
