import { Box } from "@mui/material";
import { useGetDividendDecisionsSummaryQuery } from "../../app/api";

export const DividendSummary = () => {
  const { data } = useGetDividendDecisionsSummaryQuery();

  if (!data) return null;
  return (
    <Box>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
};
