import { Box, Divider } from "@mui/material";
import { Copyright } from "./Copyright";

export const Footer = () => (
  <Box sx={{ mt: 3 }}>
    <Divider />
    <Box sx={{ p: 2 }}>
      <Copyright />
    </Box>
  </Box>
);
