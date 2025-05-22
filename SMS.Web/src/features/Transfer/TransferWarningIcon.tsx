import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { TransfereeDto } from "../../app/api";

export const TransferWarningIcon = ({
  transferee,
}: {
  transferee: TransfereeDto;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (transferee.transferredAmount === transferee.amount) {
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
          <Typography variant="caption" color="warning.main">
            {`Transferred amount doesn't match with Total to Transfer`}
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
};
