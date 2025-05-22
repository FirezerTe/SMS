import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import {
  ShareholderSubscriptionDto,
  useGetTransfersByShareholderIdQuery,
} from "../../app/api";
import { ApprovalStatus } from "../../app/api/enums";
import { useShareholderIdAndVersion } from "../shareholder";
import { ShareholderSubscriptionsGrid } from "./ShareholderSubscriptionsGrid";
import { useShareholderSubscriptions } from "./useShareholderSubscriptions";

export type SubscriptionAction = "edit" | "viewDetail" | "pay";

export const ShareholderSubscriptionsList = ({
  approvalStatus,
  onRowSelect,
}: {
  approvalStatus: ApprovalStatus;
  onRowSelect: (
    action: SubscriptionAction,
    subscription: ShareholderSubscriptionDto
  ) => void;
}) => {
  const { id } = useShareholderIdAndVersion();

  const { subscriptions: allSubscriptions } = useShareholderSubscriptions();

  const { data: allTransfers } = useGetTransfersByShareholderIdQuery(
    { shareholderId: id },
    { skip: !id }
  );

  const transfer = useMemo(
    () =>
      allTransfers?.find((t) => t.approvalStatus !== ApprovalStatus.Approved),
    [allTransfers]
  );

  const subscriptions = useMemo(() => {
    const { approved, draft, submitted, rejected } = allSubscriptions || {};

    return approvalStatus === ApprovalStatus.Draft
      ? draft
      : approvalStatus === ApprovalStatus.Approved
      ? approved
      : approvalStatus === ApprovalStatus.Submitted
      ? submitted
      : approvalStatus === ApprovalStatus.Rejected
      ? rejected
      : [];
  }, [approvalStatus, allSubscriptions]);

  const title =
    approvalStatus === ApprovalStatus.Draft
      ? "Draft"
      : approvalStatus === ApprovalStatus.Approved
      ? "Approved"
      : approvalStatus === ApprovalStatus.Submitted
      ? "Pending Approval"
      : approvalStatus === ApprovalStatus.Rejected
      ? "Rejected"
      : [];

  if (!subscriptions?.length) {
    return null;
  }

  return (
    <Box>
      <Box>
        <Typography
          variant="h6"
          sx={{ lineHeight: 2, flex: 1, py: 1 }}
          color="textSecondary"
        >
          {title}
        </Typography>
      </Box>
      <Box>
        <ShareholderSubscriptionsGrid
          subscriptions={subscriptions}
          onRowSelect={onRowSelect}
          transfer={transfer}
        />
      </Box>
    </Box>
  );
};
