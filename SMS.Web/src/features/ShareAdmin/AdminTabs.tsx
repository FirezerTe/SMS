import GroupWorkIcon from "@mui/icons-material/GroupWork";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  {
    label: "Bank Allocation",
    icon: <MonetizationOnIcon fontSize="small" />,
    href: "/admin/bank-allocation",
  },
  {
    label: "Par Values",
    icon: <MonetizationOnIcon fontSize="small" />,
    href: "/admin/par-values",
  },
  {
    label: "Allocations",
    icon: <MonetizationOnIcon fontSize="small" />,
    href: "/admin/allocations",
  },
  {
    label: "Subscription Groups",
    href: "/admin/subscription-groups",
    icon: <GroupWorkIcon fontSize="small" />,
  },
  {
    label: "Dividend Setup",
    href: "/admin/dividend-setup",
    icon: <SettingsIcon fontSize="small" />,
  },
];
export const AdminTabs = () => {
  const { pathname } = useLocation();

  const currentTabIndex = useMemo(() => {
    const tabIndex = tabs.findIndex((t) => t.href === pathname);
    return tabIndex >= 0 ? tabIndex : 0;
  }, [pathname]);
  return (
    <Box sx={{ bgcolor: "#002a73", mb: 2 }}>
      <Tabs value={currentTabIndex} scrollButtons="auto">
        {tabs.map(({ label, icon, href }) => (
          <Tab
            key={label}
            component={Link}
            color="inherit"
            to={href}
            label={label}
            relative="path"
            icon={icon}
            iconPosition="start"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&.Mui-selected": {
                color: "#fff",
                transform: "scale(1.2)",
              },
              "&.Mui-focusVisible": {
                backgroundColor: "rgba(100, 95, 228, 0.32)",
              },
              mx: 1,
            }}
          ></Tab>
        ))}
      </Tabs>
    </Box>
  );
};
