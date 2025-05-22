import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AdminTabs } from "./AdminTabs";

export const Admin = () => {
  return (
    <>
      <AdminTabs />
      <Box>
        <Outlet />
      </Box>
    </>
  );
};
