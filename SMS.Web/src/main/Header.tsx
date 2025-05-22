import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, ButtonBase, Divider, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useLogoutMutation } from "../app/api";
import { ReportsDialog } from "../features/Reports";
import { useAuth, useModal } from "../hooks";
import { Logo } from "./Logo";
import { LoggedInUser } from "./account/LoggedInUser";

const noop = () => {};

export const Header = ({
  onMenuClick,
  opened,
}: {
  onMenuClick: () => void;
  opened: boolean;
}) => {
  const [logout] = useLogoutMutation();
  const { loggedIn } = useAuth();
  const { isOpen, toggle } = useModal();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {loggedIn && (
            <Button
              sx={{ px: 2 }}
              startIcon={opened ? <ChevronLeftIcon /> : <MenuIcon />}
              onClick={onMenuClick}
            >
              Menu
            </Button>
          )}
          <Link
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ cursor: "pointer", textDecoration: "none", color: "#002a73" }}
          >
            Share Management System (SMS)
          </Link>
        </Box>
        <Box sx={{ flex: 1 }}></Box>
        <Box
          component="span"
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ButtonBase disableRipple sx={{ width: "260px" }} onClick={noop}>
            <Logo />
          </ButtonBase>
        </Box>
        {loggedIn && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ mx: 2 }}>
              {" "}
              <Button
                sx={{ textTransform: "none" }}
                onClick={() => {
                  toggle();
                }}
              >
                Reports
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{ textTransform: "none" }}
                // disabled={result?.isLoading}
                onClick={() => logout()}
              >
                Logout
              </Button>
              <Divider
                orientation="vertical"
                sx={{ height: "auto", alignSelf: "stretch", mx: 2 }}
              />
              <LoggedInUser />
            </Box>
          </Box>
        )}
      </Box>
      {!!isOpen && <ReportsDialog open={isOpen} onClose={toggle} />}
    </>
  );
};
