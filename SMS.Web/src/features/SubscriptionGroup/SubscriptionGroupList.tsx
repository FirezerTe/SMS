import {
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import orderBy from "lodash-es/orderBy";
import { Fragment, useCallback } from "react";
import { SubscriptionGroupInfo, SubscriptionPremiumDto } from "../../app/api";
import { FormattedText } from "../../components";
import { PaymentUnitLabel } from "../../utils";

export type SubscriptionGrp = SubscriptionGroupInfo & {
  allocationName?: string;
};

export const SubscriptionGroupList = ({
  subscriptionGroups = [],
  onSelect,
}: {
  subscriptionGroups: SubscriptionGrp[];
  onSelect: (subscriptionGroup: SubscriptionGrp) => void;
}) => {
  const handleRowClick = useCallback(
    (grp: SubscriptionGrp) => (_e: any) => {
      !grp.isDividendCapitalization && onSelect(grp);
    },
    [onSelect]
  );
  return (
    <>
      <Paper>
        <TableContainer>
          <Table
            sx={{ minWidth: 400 }}
            size="medium"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Minimum Subscription Amount</TableCell>
                <TableCell>Minimum First Payment Amount</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Allocation</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(subscriptionGroups || []).map((grp) => (
                <TableRow
                  hover={true}
                  key={grp.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                    verticalAlign: "top",
                  }}
                  onClick={handleRowClick(grp)}
                >
                  <TableCell sx={{ verticalAlign: "top" }}>
                    {grp.name}
                  </TableCell>
                  <TableCell>
                    {grp.expireDate &&
                      dayjs(grp.expireDate).format("MMMM D, YYYY")}
                  </TableCell>
                  <TableCell>{grp.minimumSubscriptionAmount}</TableCell>
                  <TableCell>
                    {grp.minFirstPaymentAmount}{" "}
                    {(grp.minFirstPaymentAmountUnit &&
                      PaymentUnitLabel[grp.minFirstPaymentAmountUnit]) ||
                      ""}
                  </TableCell>
                  <TableCell>
                    <SubscriptionPremium premium={grp.subscriptionPremium} />
                  </TableCell>
                  <TableCell>{grp.allocationName}</TableCell>
                  <TableCell sx={{ maxWidth: "30%" }}>
                    <FormattedText text={grp.description} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

const SubscriptionPremium = ({
  premium,
}: {
  premium?: SubscriptionPremiumDto;
}) => {
  if (!premium?.ranges?.length) return null;

  const ranges = orderBy(premium.ranges, "upperBound");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {ranges.map((range, index) => (
        <Fragment key={`${range.upperBound}-${index}`}>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 1 }}>
              {index == 0 ? (
                <Typography variant="body2">
                  {"<="} {range.upperBound}
                </Typography>
              ) : (
                <Typography variant="body2">
                  {">"} {ranges[index - 1].upperBound}{" "}
                  {(range.upperBound && " AND <= ") || ""}
                  {range.upperBound}
                </Typography>
              )}
            </Box>
            <Box sx={{ ml: 1 }}>
              <Typography variant="subtitle2" color={"info.main"}>
                {range.percentage} %
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ flex: 1 }} />
        </Fragment>
      ))}

      {/* <pre>{JSON.stringify(ranges, null, 2)}</pre> */}
    </Box>
  );
};
