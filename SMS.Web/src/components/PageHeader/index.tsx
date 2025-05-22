import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export const PageHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: ReactNode;
}) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Typography sx={{ ml: 2, mb: 2 }} variant="h4" color="primary.dark">
      {icon} {title}
    </Typography>
  </Box>
);
