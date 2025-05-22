import { DynamicForm } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import GroupsIcon from "@mui/icons-material/Groups";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../hooks";

interface NavMenuItem {
  label: string;
  icon: any;
  url?: string;
  subGroup?: NavMenuItem[];
  subMenu?: NavMenuItem[];
}
const navMenuItems: NavMenuItem[] = [
  {
    label: "Dashboard",
    icon: <DashboardIcon color="primary" />,
    url: "/",
  },

  {
    label: "SMS Admin",
    icon: <AccountBalanceIcon color="primary" />,
    subGroup: [
      {
        label: "Bank Allocation",
        icon: <MonetizationOnIcon color="warning" />,
        url: "/admin/bank-allocation",
      },
      {
        label: "Par Values",
        icon: <MonetizationOnIcon color="warning" />,
        url: "/admin/par-values",
      },
      {
        label: "Allocations",
        icon: <MonetizationOnIcon color="warning" />,
        url: "/admin/allocations",
      },
      {
        label: "Subscription Groups",
        url: "/admin/subscription-groups",
        icon: <GroupWorkIcon color="warning" />,
      },
      {
        label: "Dividend Setup",
        url: "/admin/dividend-setup",
        icon: <SettingsIcon color="warning" />,
      },
    ],
  },
  {
    label: "System Admin",
    icon: <AdminPanelSettingsIcon color="primary" />,
    url: "/sys-admin",
  },
  {
    label: "Shareholders",
    icon: <GroupsIcon color="primary" />,
    url: "/shareholders",
  },
  {
    label: "Reports",
    icon: <BarChartIcon color="primary" />,
    url: "/reports",
  },
  {
    label: "EndOfDay",
    icon: <DynamicForm color="primary" />,
    url: "/endofday",
  },
];

interface Props {
  opened: boolean;
  onClose: () => void;
}

const NavItem = ({
  menuItem,
  sx,
  opened,
  onClose,
  disabled,
}: {
  menuItem: NavMenuItem;
  onClose: () => void;
  sx?: SxProps<Theme> | undefined;
  opened: boolean;
  disabled?: boolean;
}) => {
  const navigator = useNavigate();
  const [subMenuOpened, setSubMenuOpened] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigateToPage = useCallback(
    (url: string) => {
      navigator(url);
    },
    [navigator]
  );

  const onNavItemClick = useCallback(
    (item: NavMenuItem): MouseEventHandler<HTMLDivElement> =>
      (event) => {
        if (menuItem?.subGroup?.length) {
          setSubMenuOpened(!subMenuOpened);
          setAnchorEl(event.currentTarget);
        } else {
          item?.url && navigateToPage(item.url);
        }
      },
    [menuItem?.subGroup?.length, navigateToPage, subMenuOpened]
  );

  useEffect(() => {
    !opened && setAnchorEl(null);
  }, [opened]);

  useEffect(() => {
    opened && setSubMenuOpened(false);
  }, [opened]);

  return (
    <ListItem key={menuItem.label} disablePadding sx={{ display: "block" }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: opened ? "initial" : "center",
          px: 2.5,
          ...sx,
        }}
        onClick={onNavItemClick(menuItem)}
        disabled={disabled}
      >
        <ListItemIcon
          sx={{
            my: "auto",
            minWidth: "36px",
            mr: opened ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {menuItem.icon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={"body1"} color="inherit">
              {menuItem.label}
            </Typography>
          }
          sx={{ opacity: opened ? 1 : 0 }}
        />
        {!menuItem?.subGroup?.length || !opened ? null : subMenuOpened ? (
          <ExpandLess />
        ) : (
          <ExpandMore />
        )}
      </ListItemButton>

      {!!menuItem?.subGroup?.length && (
        <>
          {opened && (
            <Collapse in={subMenuOpened} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {menuItem.subGroup.map((item, label) => (
                  <NavItem
                    key={label}
                    sx={{ pl: 4 }}
                    menuItem={item}
                    onClose={onClose}
                    opened={true}
                  />
                ))}
              </List>
            </Collapse>
          )}
          {!opened && anchorEl && (
            <Popover
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "left",
              }}
              open={Boolean(anchorEl)}
              onClose={() => {
                setAnchorEl(null);
              }}
            >
              <List component="div" disablePadding>
                {menuItem.subGroup.map((item, label) => (
                  <NavItem
                    key={label}
                    sx={{ pl: 4 }}
                    menuItem={item}
                    onClose={onClose}
                    opened={true}
                  />
                ))}
              </List>
            </Popover>
          )}
        </>
      )}
    </ListItem>
  );
};
export const LeftNav = ({ opened, onClose }: Props) => {
  const permissions = usePermission();

  const menuItems = useMemo(() => {
    return navMenuItems.filter(
      (item) =>
        (item.url !== "/sys-admin" || permissions.canCreateOrUpdateUser) &&
        (item.url !== "/endofday" || permissions.canProcessEndOfDay)
    );
  }, [permissions.canCreateOrUpdateUser, permissions.canProcessEndOfDay]);

  return (
    <List>
      {menuItems.map((item, label) => (
        <NavItem
          menuItem={item}
          key={label}
          onClose={onClose}
          opened={opened}
        />
      ))}
    </List>
  );
};
