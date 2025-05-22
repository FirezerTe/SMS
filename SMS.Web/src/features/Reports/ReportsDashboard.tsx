import BarChartIcon from "@mui/icons-material/BarChart";
import { Box } from "@mui/material";
import { PageHeader } from "../../components";

export const ReportsDashboard = () => (
  <Box>
    <PageHeader
      icon={
        <BarChartIcon sx={{ fontSize: "inherit", verticalAlign: "middle" }} />
      }
      title={"Reports Dashboard"}
    />
  </Box>
);
