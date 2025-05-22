import { AppBar, Box, styled, Toolbar, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { useNotification } from "../../features/notification";
import { useAuth } from "../../hooks";
import { Footer } from "../../main/Footer";
import { Header } from "../../main/Header";
import Routes from "../routes";
import { LeftNav } from "./LeftNav";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, Theme } from "@mui/material/styles";

const drawerWidth = 280;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});
const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const MainLayout = () => {
  const theme = useTheme();
  useNotification();
  const [open, setOpen] = useState(false);
  const { loggedIn } = useAuth();

  const onMenuClose = useCallback(() => {
    setOpen(false);
    handleDrawerClose();
  }, []);

  const onMenuOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={1}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: open ? theme.transitions.create("width") : "none",
        }}
      >
        <Toolbar disableGutters sx={{ mx: 2 }}>
          <Header onMenuClick={onMenuOpen} opened={open} />
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          padding: 2,
          boxSizing: "border-box",
          zIndex: 0,
        }}
      >
        <Box sx={{ display: "flex", flex: 1 }}>
          {loggedIn && (
            <>
              <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                  <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "rtl" ? (
                      <ChevronRightIcon />
                    ) : (
                      <ChevronLeftIcon />
                    )}
                  </IconButton>
                </DrawerHeader>
                <Divider />
                <LeftNav opened={open} onClose={onMenuClose} />
              </Drawer>
            </>
          )}
          <MainContainer
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <Box sx={{ flex: 1, display: "flex" }}>
              <Box sx={{ flex: 1, py: 1, px: 2 }}>
                <Routes />
              </Box>
            </Box>
            <Footer />
          </MainContainer>
        </Box>
      </Box>
    </Box>
  );
};

const MainContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flex: 1,
});
