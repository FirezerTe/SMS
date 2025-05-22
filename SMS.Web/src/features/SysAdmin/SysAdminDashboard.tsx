import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Box, Divider, Paper, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link, Outlet } from "react-router-dom";
import { PageHeader } from "../../components";

interface TabProps {
  label: string;
  href: string;
}

const getTabs = (): TabProps[] => [
  {
    label: "Users",
    href: "/sys-admin/users",
  },
];

export const SysAdminDashboard = () => {
  const tabs = useMemo(() => getTabs(), []);
  const getCurrentTabIndex = () => {
    const tabIndex = tabs.findIndex((t) => t.href === location.pathname);
    return tabIndex >= 0 ? tabIndex : 0;
  };

  return (
    <Box>
      <PageHeader
        icon={
          <AdminPanelSettingsIcon
            sx={{ fontSize: "inherit", verticalAlign: "middle" }}
          />
        }
        title={"System Admin"}
      />
      <Paper sx={{ p: 2, flex: 1 }}>
        <Tabs value={getCurrentTabIndex()}>
          {tabs.map(({ href, label }) => (
            <Tab
              key={label}
              component={Link}
              color="inherit"
              to={href}
              label={label}
            ></Tab>
          ))}
        </Tabs>
        <Divider />
        <Outlet />
      </Paper>
    </Box>
  );
};
