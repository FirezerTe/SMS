import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { ApprovalStatus } from "../../api-client/api-client";
import {
  ShareholderSubscriptionDto,
  useGetSubscriptionPaymentsQuery,
} from "../../app/api";
import { PaymentType, PaymentUnit } from "../../app/api/enums";
import { useSubscriptionGroups } from "../SubscriptionGroup";
import { formatNumber } from "../common";
import { useShareholderSubscriptions } from "./useShareholderSubscriptions";
import { useSubscriptionDocuments } from "./useSubscriptionDocuments";

export const SubscriptionWarningIcon = ({
  subscription,
}: {
  subscription: ShareholderSubscriptionDto;
}) => {
  const { premiumPaymentReceipt, subscriptionForm } = useSubscriptionDocuments(
    subscription.shareholderId,
    subscription.id
  );

  const { data: payments } = useGetSubscriptionPaymentsQuery(
    {
      id: subscription.id!,
    },
    { skip: !subscription.id }
  );

  const { subscriptionGroups } = useSubscriptionGroups();

  const {
    paidMinReqFirstPayment,
    minReqFirstPayment,
    hasMissingPaymentReceiptAttachment,
  } = useMemo(() => {
    const { approved, draft, rejected, submitted } = payments || {};
    let allPayments = [
      ...(approved || []),
      ...(submitted || []),
      ...(draft || []),
    ];

    const _rejected = (rejected || []).filter(
      (r) => !allPayments.some((p) => p.id === r.id)
    );

    allPayments = [...allPayments, ..._rejected];

    const totalPaymentAmount = allPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    const subscriptionGroup = subscriptionGroups?.find(
      (s) => s.id === subscription.subscriptionGroupID
    );

    const minReqFirstPayment =
      subscriptionGroup?.minFirstPaymentAmountUnit === PaymentUnit.Percentage
        ? ((subscriptionGroup?.minFirstPaymentAmount || 0) *
            (subscription.amount || 0)) /
          100
        : subscriptionGroup?.minFirstPaymentAmount || 0;

    const unapprovedSubscriptionPayments = allPayments.filter(
      (p) =>
        p.paymentTypeEnum === PaymentType.SubscriptionPayment &&
        p.approvalStatus !== ApprovalStatus.Approved
    );

    const hasMissingPaymentReceiptAttachment =
      unapprovedSubscriptionPayments.length &&
      unapprovedSubscriptionPayments.some((p) => !p.receipts?.length);

    return {
      minReqFirstPayment,
      paidMinReqFirstPayment: totalPaymentAmount >= minReqFirstPayment,
      hasMissingPaymentReceiptAttachment,
    };
  }, [
    payments,
    subscription.amount,
    subscription.subscriptionGroupID,
    subscriptionGroups,
  ]);

  const { hasApprovedSubscription } = useShareholderSubscriptions();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (subscription.approvalStatus === ApprovalStatus.Approved) return null;

  const allReqAttachmentsUploaded =
    !!(hasApprovedSubscription || premiumPaymentReceipt) && !!subscriptionForm;

  if (
    allReqAttachmentsUploaded &&
    paidMinReqFirstPayment &&
    !hasMissingPaymentReceiptAttachment
  ) {
    return null;
  }

  return (
    <Box>
      <IconButton
        aria-label="warning"
        color="error"
        size="small"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <WarningAmberIcon fontSize="inherit" />
      </IconButton>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box sx={{ p: 1, display: "flex", flexDirection: "column" }}>
          {!subscriptionForm && (
            <Typography variant="caption" color="warning.main">
              Subscription Form is not attached
            </Typography>
          )}
          {!hasApprovedSubscription && !premiumPaymentReceipt && (
            <Typography variant="caption" color="warning.main">
              Premium Payment Receipt is not attached
            </Typography>
          )}
          {!paidMinReqFirstPayment && (
            <Typography variant="caption" color="warning.main">
              Minimum required payment is not paid (
              {`${formatNumber(minReqFirstPayment)} ETB`})
            </Typography>
          )}
          {!!hasMissingPaymentReceiptAttachment && (
            <Typography variant="caption" color="warning.main">
              Subscription Payment Receipt is not attached
            </Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
};
