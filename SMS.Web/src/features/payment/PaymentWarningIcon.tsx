import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { SubscriptionPaymentDto } from "../../app/api";
import { ApprovalStatus, PaymentType } from "../../app/api/enums";

export const PaymentWarningIcon = ({
  payment,
}: {
  payment: SubscriptionPaymentDto;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const hasMissingPaymentReceiptAttachment =
    payment.approvalStatus !== ApprovalStatus.Approved &&
    payment?.paymentMethodEnum === PaymentType.SubscriptionPayment &&
    !payment.receipts?.length;

  if (!payment) return null;

  if (!hasMissingPaymentReceiptAttachment) {
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
          {!!hasMissingPaymentReceiptAttachment && (
            <Typography variant="caption" color="warning.main">
              Receipt is not attached
            </Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
};
