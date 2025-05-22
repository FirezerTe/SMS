import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Collapse,
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
import { useCallback, useMemo, useState } from "react";
import { ApprovalStatus } from "../../api-client/api-client";
import { ShareholderSubscriptionDto, TransferDto } from "../../app/api";
import { ShareholderChangeLogEntityType } from "../../app/api/enums";
import { usePermission } from "../../hooks";
import { getChangelogStyle } from "../../utils";
import { useBranches } from "../Branch";
import { useDistricts } from "../District";
import { useSubscriptionGroups } from "../SubscriptionGroup";
import { formatNumber } from "../common";
import { SubscriptionPayments } from "../payment";
import { useShareholderChangeLogs } from "../shareholder/shareholderDetail/shareholderChangeLog";
import { SubscriptionWarningIcon } from "./SubscriptionWarningIcon";

export type SubscriptionAction = "edit" | "viewDetail" | "pay";

interface Props {
  subscriptions?: ShareholderSubscriptionDto[];
  transfer?: TransferDto;
  onRowSelect: (
    action: SubscriptionAction,
    subscription: ShareholderSubscriptionDto
  ) => void;
}

export const ShareholderSubscriptionsGrid = ({
  transfer,
  subscriptions,
  onRowSelect,
}: Props) => {
  return (
    !!subscriptions?.length && (
      <Paper>
        <TableContainer>
          <Table
            sx={{ minWidth: 400 }}
            size="medium"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Approved</TableCell>
                <TableCell>Pending Approval</TableCell>
                <TableCell>Subscription Date</TableCell>
                <TableCell>Subscription Group</TableCell>
                <TableCell>
                  {"Subscription Location "}
                  <Typography
                    component={"span"}
                    variant="subtitle2"
                    sx={{ display: "inline-block" }}
                  >
                    {` (District/Branch)`}
                  </Typography>
                </TableCell>
                <TableCell>Reference #</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((subscription) => (
                <SubscriptionRow
                  key={subscription.id}
                  subscription={subscription}
                  onRowSelect={onRowSelect}
                  transfer={transfer}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    )
  );
};

const SubscriptionRow = ({
  subscription,
  onRowSelect,
  transfer,
}: {
  subscription: ShareholderSubscriptionDto;
  transfer?: TransferDto;
  onRowSelect: (
    action: SubscriptionAction,
    subscription: ShareholderSubscriptionDto
  ) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { subscriptionGroups } = useSubscriptionGroups();
  const { districts } = useDistricts();
  const { branches } = useBranches();
  const permissions = usePermission();

  const { changeLogs } = useShareholderChangeLogs();

  const getChangeLog = useCallback(
    (address: ShareholderSubscriptionDto) =>
      changeLogs?.find(
        (c) =>
          c.entityType === ShareholderChangeLogEntityType.Subscription &&
          c.entityId === address.id
      ),
    [changeLogs]
  );

  const mappedSubscription = useMemo(() => {
    return {
      ...subscription,
      amount: subscription.amount,
      subscriptionGroup: subscriptionGroups?.find(
        (g) => g.id === subscription.subscriptionGroupID
      )?.name,
      district:
        districts?.find((d) => d.id === subscription.subscriptionDistrictID)
          ?.districtName || "-",
      branch:
        branches?.find((b) => b.id === subscription.subscriptionBranchID)
          ?.branchName || "-",
    };
  }, [branches, districts, subscription, subscriptionGroups]);

  const canAddPayment =
    (subscription.amount || 0) >
    (mappedSubscription.paymentSummary?.totalApprovedPayments || 0) +
      (mappedSubscription.paymentSummary?.totalPendingApprovalPayments || 0);

  return (
    <>
      <TableRow
        hover={false}
        sx={{
          "& > *": { borderBottom: "0" },
          ...getChangelogStyle(getChangeLog(subscription)),
        }}
      >
        <TableCell sx={{ borderBottomWidth: 0, width: 150 }}>
          <Button
            onClick={() => setOpen(!open)}
            startIcon={
              open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
            }
          >
            {`${!open ? "View" : "Hide"} Payments`}
          </Button>
        </TableCell>
        <TableCell sx={{ borderBottomWidth: 0 }}>
          <Typography variant="subtitle2" color="info.main" sx={{ flex: 1 }}>
            {formatNumber(mappedSubscription.amount)}
          </Typography>
        </TableCell>
        <TableCell sx={{ borderBottomWidth: 0 }}>
          <Typography variant="subtitle2" color="success.main" sx={{ flex: 1 }}>
            {formatNumber(
              mappedSubscription.paymentSummary?.totalApprovedPayments
            )}
          </Typography>
        </TableCell>
        <TableCell sx={{ borderBottomWidth: 0 }}>
          <Typography variant="subtitle2" color="warning.main" sx={{ flex: 1 }}>
            {formatNumber(
              mappedSubscription.paymentSummary?.totalPendingApprovalPayments
            )}
          </Typography>
        </TableCell>
        <TableCell sx={{ borderBottomWidth: 0 }}>
          {(mappedSubscription.subscriptionDate &&
            dayjs(mappedSubscription.subscriptionDate).format(
              "MMMM D, YYYY"
            )) ||
            ""}
        </TableCell>
        <TableCell sx={{ borderBottomWidth: 0 }}>
          {mappedSubscription.subscriptionGroup}
        </TableCell>
        <TableCell
          sx={{ borderBottomWidth: 0 }}
        >{`${mappedSubscription.district}/${mappedSubscription.branch}`}</TableCell>
        <TableCell sx={{ borderBottomWidth: 0 }}>
          {mappedSubscription.subscriptionOriginalReferenceNo}
        </TableCell>
        <TableCell sx={{ width: 240, borderBottomWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {canAddPayment && (
              <Button
                size="small"
                onClick={() => onRowSelect("pay", mappedSubscription)}
                startIcon={<AddIcon />}
                disabled={!permissions.canCreateOrUpdatePayment}
              >
                Payment
              </Button>
            )}
            <Button
              size="small"
              onClick={() => onRowSelect("viewDetail", mappedSubscription)}
              startIcon={<VisibilityIcon />}
            >
              Detail
            </Button>
            {mappedSubscription.approvalStatus !== ApprovalStatus.Approved &&
              permissions.canCreateOrUpdateSubscription && (
                <Button
                  size="small"
                  onClick={() => onRowSelect("edit", mappedSubscription)}
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
              )}
            {<SubscriptionWarningIcon subscription={subscription} />}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, backgroundColor: "#fafafb", py: 1 }}>
              {subscription.id && (
                <SubscriptionPayments
                  transfer={transfer}
                  subscriptionId={subscription.id}
                />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
