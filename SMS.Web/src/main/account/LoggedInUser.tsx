import {
  Avatar,
  Box,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLogoutMutation } from "../../app/api";
import { useAuth } from "../../hooks";
import { ChangePasswordDialog } from "./ChangePassword";

export const LoggedInUser = () => {
  const [logout] = useLogoutMutation();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openChangePwdDialog, setOpenChangePwdDialog] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {" "}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontStyle: "italic", mr: 1 }} variant="body2">
          {user?.fullName}
        </Typography>
        <Box>
          <IconButton onClick={handleClick}>
            <Avatar sx={{ width: 32, height: 32, mr: 0.5, fontSize: 16 }} />
          </IconButton>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
            TransitionComponent={Fade}
          >
            <MenuItem
              onClick={() => {
                setOpenChangePwdDialog(true);
                closeMenu();
              }}
            >
              Change Password
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      {openChangePwdDialog && (
        <ChangePasswordDialog
          onClose={() => {
            setOpenChangePwdDialog(false);
          }}
        />
      )}
    </>
  );
};
